'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const business = require('.');

const logger = createLogger('mylife:gallery:business:person');

exports.personList = () => {
  const persons = getStoreCollection('persons');
  return persons.list();
};

exports.personGet = (id) => {
  const persons = getStoreCollection('persons');
  return persons.get(id);
};

exports.personIsThumbnailUsed = (thumbnailId) => {
  for(const person of getStoreCollection('persons')) {
    if(person.thumbnails.includes(thumbnailId)) {
      return true;
    }
  }

  return false;
};

exports.personCreate = personCreate;
function personCreate(values) {
  const entity = getMetadataEntity('person');
  const persons = getStoreCollection('persons');
  const newPerson = entity.newObject(values);

  const item = persons.set(newPerson);
  logger.info(`Created person '${item._id}'`);
  return item;
}

exports.personDelete = async (person) => {
  logger.info(`Deleting person '${person._id}'`);

  for(const document of business.documentListByPerson(person)) {
    business.documentRemovePerson(document, person);
  }

  const collection = getStoreCollection('persons');
  if(!collection.delete(person._id)) {
    throw new Error(`Cannot delete person '${person._id}' : document not found in collection`);
  }

  for(const thumbnailId of person.thumbnails) {
    await business.thumbnailRemoveIfUnused(thumbnailId);
  }
};

exports.personUpdate = (person, values) => {
  logger.info(`Setting values '${JSON.stringify(values)}' on person '${person._id}'`);

  const entity = getMetadataEntity('person');
  const persons = getStoreCollection('persons');
  const newPerson = entity.setValues(person, values);

  persons.set(newPerson);
};

exports.personCreateFromDocuments = (firstName, lastName, documents) => {
  // take first image thumbnail
  const doc = documents
    .map(ref => business.documentGet(ref.type, ref.id))
    .find(doc => doc._entity === 'image');
  const thumbnails = doc ? [doc.thumbnail] : [];

  const person = personCreate({ firstName, lastName, thumbnails });

  for(const { type, id } of documents) {
    const document = business.documentGet(type, id);
    business.documentAddPerson(document, person);
  }

  return person;
};

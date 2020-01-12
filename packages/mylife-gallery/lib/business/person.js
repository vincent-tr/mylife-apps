'use strict';

const { createLogger, getStoreCollection, getMetadataEntity, notifyView } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
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

  const collection = getStoreCollection('persons');
  if(!collection.delete(person._id)) {
    throw new Error(`Cannot delete person '${person._id}' : document not found in collection`);
  }

  for(const thumbnailId of person.thumbnails) {
    await business.thumbnailRemoveIfUnused(thumbnailId);
  }

  // TODO: update document that reference it
};

exports.personsNotify = (session) => {
  const persons = getStoreCollection('persons');
  return notifyView(session, persons.createView());
};

import { createLogger, getStoreCollection, getMetadataEntity } from 'mylife-tools-server';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:person');

export function personList() {
  const persons = getStoreCollection('persons');
  return persons.list();
}

export function personGet(id) {
  const persons = getStoreCollection('persons');
  return persons.get(id);
}

export function personIsThumbnailUsed(thumbnailId) {
  const persons = getStoreCollection('persons');
  for(const person of persons.list()) {
    if(person.thumbnails.includes(thumbnailId)) {
      return true;
    }
  }

  return false;
}

export function personCreate(values) {
  const entity = getMetadataEntity('person');
  const persons = getStoreCollection('persons');
  const newPerson = entity.newObject(values);

  const item = persons.set(newPerson);
  logger.info(`Created person '${item._id}'`);
  return item;
}

export async function personDelete(person) {
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
}

export function personUpdate(person, values) {
  logger.info(`Setting values '${JSON.stringify(values)}' on person '${person._id}'`);

  const entity = getMetadataEntity('person');
  const persons = getStoreCollection('persons');
  const newPerson = entity.setValues(person, values);

  persons.set(newPerson);
}

export function personCreateFromDocuments(firstName, lastName, documents) {
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
}

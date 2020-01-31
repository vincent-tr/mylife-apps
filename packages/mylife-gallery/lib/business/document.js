'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const business = require('.');

const logger = createLogger('mylife:gallery:business:document');

exports.documentList = documentList;
function documentList() {
  return getDocumentStoreCollections().map(collection => collection.list()).flat();
}

exports.documentGet = (type, id) => {
  return getDocumentStoreCollection(type).get(id);
};

exports.documentFilter = documentFilter;
function documentFilter(predicate) {
  return getDocumentStoreCollections().map(collection => collection.filter(predicate)).flat();
}

exports.documentFindByHash = (hash) => {
  return documentFilter(document => document.hash === hash)[0];
};

exports.documentListByPerson = (person) => {
  const list = [];
  // other has no person
  const collections = [getStoreCollection('images'), getStoreCollection('videos')];
  for(const collection of collections) {
    for(const document of collection.list()) {
      if(document.persons.includes(person._id)) {
        list.push(document);
      }
    }
  }
  return list;
};

exports.documentIsThumbnailUsed = (thumbnailId) => {
  for(const document of getStoreCollection('images').list()) {
    if(document.thumbnail === thumbnailId) {
      return true;
    }
  }

  for(const document of getStoreCollection('videos').list()) {
    if(document.thumbnails.includes(thumbnailId)) {
      return true;
    }
  }

  // other has no thumbnail
  return false;
};

exports.documentCreate = (type, values) => {
  const entity = getMetadataEntity(type);
  const collection = getDocumentStoreCollection(type);
  const newDocument = entity.newObject(values);

  const item = collection.set(newDocument);
  logger.info(`Created document '${item._entity}:${item._id}'`);
  return item;
};

exports.documentRemove = async (document) => {
  logger.info(`Deleting document '${document._entity}:${document._id}'`);

  const type = document._entity;
  const id = document._id;

  const reference = { type, id };
  for(const album of business.albumListWithDocumentReference(reference)) {
    business.albumRemoveDocuments(album, [reference]);
  }

  const collection = getDocumentStoreCollection(type);
  if(!collection.delete(id)) {
    throw new Error(`Cannot delete document '${type}:${id}' : document not found in collection`);
  }

  switch(type) {
    case 'image':
    case 'video': {
      const mediaId = document.media.id;
      await business.mediaRemove(mediaId);
      break;
    }
  }

  switch(type) {
    case 'image': {
      await business.thumbnailRemoveIfUnused(document.thumbnail);
      break;
    }

    case 'video': {
      for(const thumbnailId of document.thumbnails) {
        await business.thumbnailRemoveIfUnused(thumbnailId);
      }
      break;
    }
  }
};

exports.documentUpdate = (document, values) => {
  logger.info(`Setting values '${JSON.stringify(values)}' on document '${document._entity}:${document._id}'`);

  const type = document._entity;
  const collection = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const newDocument = entity.setValues(document, values);

  collection.set(newDocument);

  const isDateChange = document._entity !== 'other' && dateEquals(document.date, newDocument.date);
  if(isDateChange) {
    // need to update album order
    const reference = { type, id: document._id };
    for(const album of business.albumListWithDocumentReference(reference)) {
      business.albumSortDocuments(album);
    }
  }
};

exports.documentAddPerson = (document, person) => {
  const type = document._entity;
  if(type !== 'image' && type !== 'video') {
    throw new Error(`Invalid document type for document '${document._entity}:${document._id}' to call 'documentAddPerson'`);
  }
  const documents = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const index = findPersonIndex(document, person._id);
  if(index !== -1) {
    throw new Error('La personne existe déjà sur le document');
  }

  const newPersons = utils.immutable.arrayPush(document.persons, person._id);
  const newDocument = entity.getField('persons').setValue(document, newPersons);

  logger.info(`Adding person '${person._id}' on document '${document._entity}:${document._id}'`);
  documents.set(newDocument);
};

exports.documentRemovePerson = (document, person) => {
  const type = document._entity;
  if(type !== 'image' && type !== 'video') {
    throw new Error(`Invalid document type for document '${document._entity}:${document._id}' to call 'documentAddPerson'`);
  }
  const documents = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const index = findPersonIndex(document, person._id);
  if(index === -1) {
    throw new Error('La personne n\'existe pas sur le document');
  }

  const newPersons = utils.immutable.arrayRemove(document.persons, index);
  const newDocument = entity.getField('persons').setValue(document, newPersons);

  logger.info(`Removing person '$${person._id}' from document '${document._entity}:${document._id}'`);
  documents.set(newDocument);
};

function findPersonIndex(document, personId) {
  return document.persons.findIndex(id => id === personId);
}

exports.documentAddKeyword = (document, keyword) => {
  const type = document._entity;
  const documents = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const index = findKeywordIndex(document, keyword);
  if(index !== -1) {
    throw new Error('Le mot clé existe déjà sur le document');
  }

  const newKeywords = utils.immutable.arrayPush(document.keywords, keyword);
  const newDocument = entity.getField('keywords').setValue(document, newKeywords);

  logger.info(`Adding keyword '${keyword}' on document '${document._entity}:${document._id}'`);
  documents.set(newDocument);
};

exports.documentRemoveKeyword = (document, keyword) => {
  const type = document._entity;
  const documents = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const index = findKeywordIndex(document, keyword);
  if(index === -1) {
    throw new Error('Le mot clé n\'existe pas sur le document');
  }

  const newKeywords = utils.immutable.arrayRemove(document.keywords, index);
  const newDocument = entity.getField('keywords').setValue(document, newKeywords);

  logger.info(`Removing keyword '$${keyword}' from document '${document._entity}:${document._id}'`);
  documents.set(newDocument);
};

function findKeywordIndex(document, keyword) {
  return document.keywords.indexOf(keyword);
}

exports.documentAddPath = (document, path, fileUpdateDate) => {
  logger.info(`Adding path '${path}' on document '${document._entity}:${document._id}'`);

  const collection = getDocumentStoreCollection(document._entity);
  const entity = getMetadataEntity(document._entity);
  const newPaths = utils.immutable.arrayPush(document.paths, { path, fileUpdateDate });
  const newDocument = entity.setValues(document, { paths: newPaths });
  collection.set(newDocument);
};

exports.documentRemovePath = (type, id, path) => {
  logger.info(`Deleting path '${path}' on document '${type}:${id}'`);

  const collection = getDocumentStoreCollection(type);
  const entity = getMetadataEntity(type);
  const document = collection.get(id);
  if(!document) {
    throwRemovePathError(type, id, path, 'document not found in collection');
  }

  const pathIndex = document.paths.findIndex(item => item.path === path);
  if(pathIndex === -1) {
    throwRemovePathError(type, id, path, 'path not found on document');
  }

  const newPaths = utils.immutable.arrayRemove(document.paths, pathIndex);
  const newDocument = entity.setValues(document, { paths: newPaths });
  collection.set(newDocument);
};

function throwRemovePathError(type, id, path, reason) {
  throw new Error(`Cannot delete path '${path}' on document '${id}' (type='${type}'): ${reason}`);
}

const ENTITY_TO_COLLECTION = {
  image: 'images',
  video: 'videos',
  other: 'others'
};

exports.getDocumentStoreCollection = getDocumentStoreCollection;
function getDocumentStoreCollection(entityId) {
  const collectionName = ENTITY_TO_COLLECTION[entityId];
  if(!collectionName) {
    throw new Error(`Unknown document type: '${entityId}'`);
  }

  return getStoreCollection(collectionName);
}

exports.getDocumentStoreCollections = getDocumentStoreCollections;
function getDocumentStoreCollections() {
  return [
    getStoreCollection('images'),
    getStoreCollection('videos'),
    getStoreCollection('others')
  ];
}

function dateEquals(date1, date2) {
  if(date1 === null && date2 === null) {
    return true;
  }
  if(date1 === null || date2 === null) {
    return false;
  }

  return date1.valueOf() === date2.valueOf();
}

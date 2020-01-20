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
    business.albumRemoveDocument(album, reference);
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
};

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

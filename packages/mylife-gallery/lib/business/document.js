'use strict';

const { createLogger, getStoreCollection, getMetadataEntity, notifyView } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
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

exports.documentNotify = (session, type, id) => {
  const collection = getDocumentStoreCollection(type);
  return notifyView(session, collection.createView(document => document._id === id));
};

exports.documentCreate = (type, values) => {
  const entity = getMetadataEntity(type);
  const collection = getDocumentStoreCollection(type);
  const newDocument = entity.newObject(values);
  return collection.set(newDocument);
};

exports.documentRemove = (type, id) => {
  logger.info(`Deleting document '${type}:${id}'`);

  const collection = getDocumentStoreCollection(type);
  if(!collection.delete(id)) {
    throw new Error(`Cannot delete document '${id}' (type='${type}'): document not found in collection`);
  }

  // TODO: delete thumbnails (image, video) if not used anymore
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

function getDocumentStoreCollection(entityId) {
  const collectionName = ENTITY_TO_COLLECTION[entityId];
  if(!collectionName) {
    throw new Error(`Unknown document type: '${entityId}'`);
  }

  return getStoreCollection(collectionName);
}

function getDocumentStoreCollections() {
  return [
    getStoreCollection('images'),
    getStoreCollection('videos'),
    getStoreCollection('others')
  ];
}

'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const logger = createLogger('mylife:gallery:business:document');


exports.documentRemovePath = (type, id, path) => {
  logger.info(`Deleting path '${path}' on document '${type}:${id}'`);

  const collection = getStoreCollection(type);
  const document = collection.get(id);
  if(!document) {
    throwRemovePathError(type, id, path, 'document not found in collection');
  }

  const pathIndex = document.paths.findIndex(item => item.path === path);
  if(pathIndex === -1) {
    throwRemovePathError(type, id, path, 'path not found on document');
  }

  const newPaths = utils.immutable.arrayRemove(document.paths, pathIndex);
  if(newPaths.length > 0) {
    const newDocument = document.setValue('paths', newPaths);
    collection.set(newDocument);
    return;
  }

  // document would have no path anymore, so let's delete it
  // TODO: delete thumbnails (image, video)
  // TODO: remove person/album thumbnails if they were used
  // TODO: delete album item if set to document
  // TODO: delete document
  throw new Error('TODO');
};

function throwRemovePathError(type, id, path, reason) {
  throw new Error(`Cannot delete path '${path}' on document '${id}' (type='${type}'): ${reason}`);
}

exports.documentAddPath = (document, path, updateDate) => {
  logger.info(`Adding path '${path}' on document '${document._entity}:${document._id}'`);

  const collection = getDocumentStoreCollection(document._entity);
  const newPaths = utils.immutable.arrayPush(document.paths, { path, updateDate });
  const newDocument = document.setValue('paths', newPaths);
  collection.set(newDocument);
};

exports.documentFindByHash = (hash) => {
  const filterFunc = document => document.hash === hash;
  for(const collection of getDocumentStoreCollections()) {
    const document = collection.filter(filterFunc)[0];
    if (document) {
      return document;
    }
  }
};

exports.documentCreate = (type, values) => {
  const entity = getMetadataEntity(type);
  const collection = getDocumentStoreCollection(type);
  const newDocument = entity.newObject(values);
  return collection.set(newDocument);
};

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

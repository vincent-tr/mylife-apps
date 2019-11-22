'use strict';

const { createLogger, getStoreCollection } = require('mylife-tools-server');
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

  const newPaths = utils.immutable.removeItem(document.paths, pathIndex);
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

exports.documentAddPath = (document, path) => {
  
};

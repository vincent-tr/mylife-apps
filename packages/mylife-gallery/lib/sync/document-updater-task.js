'use strict';

const { createLogger } = require('mylife-tools-server');
const { FileProcessorTask } = require('./file-processor-task');
const business = require('../business');

const logger = createLogger('mylife:gallery:sync:document-updater-task');

exports.DocumentUpdaterTask = class DocumentUpdaterTask {
  constructor(list) {
    this.fileList = new Map(list.map(item => [item.relativePath, item]));
  }

  async runStep() {

    logger.debug('Updating documents');

    const pathsToDelete = listPathsToDelete(this.fileList);
    removePaths(pathsToDelete);

    logger.debug(`Done updating documents: ${pathsToDelete.length} paths deleted`);

    return false;
  }

  createNextTask() {
    const list = Array.from(this.fileList.values());
    return new FileProcessorTask(list);
  }
};

function listPathsToDelete(fileList) {
  const pathsToDelete = [];

  for(const document of business.documentList()) {
    for (const { path, fileUpdateDate } of document.paths) {
      const item = fileList.get(path);
      if(!item) {
        // path has been deleted
        pushPathToDelete(pathsToDelete, document, path, 'it does not exist anymore');
        continue;
      }

      if(item.fileUpdateDate.valueOf() !== fileUpdateDate.valueOf() || item.size !== document.fileSize) {
        // path has been changed, let's delete it
        pushPathToDelete(pathsToDelete, document, path, 'its update date or size has changed');
        continue;
      }

      // path is identical, let's drop it from the process list
      fileList.delete(path);
    }
  }

  return pathsToDelete;
}

function pushPathToDelete(pathsToDelete, document, path, reason) {
  logger.debug(`Adding path '${path}' for deletion '${document._entity}:${document._id}' because ${reason}`);
  pathsToDelete.push({ type: document._entity, id: document._id, path });
}

function removePaths(pathsToDelete) {
  for(const { type, id, path } of pathsToDelete) {
    try {
      business.documentRemovePath(type, id, path);
    } catch(err) {
      logger.error(err.stack);
    }
  }
}

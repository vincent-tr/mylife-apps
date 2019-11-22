'use strict';

const { createLogger, getStoreCollection } = require('mylife-tools-server');
const { FileProcessorTask } = require('./file-processor-task');
const business = require('../business');

const logger = createLogger('mylife:gallery:sync:document-updater-task');

exports.DocumentUpdaterTask = class DocumentUpdaterTask {
  constructor(list) {
    this.fileList = new Map(list.map(item => [item.relativePath, item]));
  }

  async runStep() {

    logger.debug('Updating documents');

    const pathsToDelete = [];
    processCollection(pathsToDelete, 'images');
    processCollection(pathsToDelete, 'videos');
    processCollection(pathsToDelete, 'others');

    removePaths(pathsToDelete);

    logger.debug(`Done updating documents: ${pathsToDelete.length} paths deleted`);

    return false;
  }

  createNextTask() {
    const list = Array.from(this.fileList.values());
    return new FileProcessorTask(list);
  }
};

function processCollection(pathsToDelete, type) {
  const collection = getStoreCollection(type);
  for(const document of collection.list()) {
    for (const { path, updateDate } of document.paths) {
      const item = this.fileList.get(path);
      if(!item) {
        // path has been deleted
        pathsToDelete.push('images', document._id, path);
        continue;
      }

      if(item.updateDate !== updateDate || item.size !== document.fileSize) {
        // path has been changed, let's delete it
        pathsToDelete.push({ type, id: document._id, path });
      }

      // path is identical, let's drop it from the process list
      this.fileList.delete(path);
    }
  }
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

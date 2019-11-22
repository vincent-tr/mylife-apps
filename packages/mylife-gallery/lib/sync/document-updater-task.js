'use strict';

const { createLogger, getStoreCollection } = require('mylife-tools-server');
const { FileProcessorTask } = require('./file-processor-task');

const logger = createLogger('mylife:gallery:sync:document-updater-task');

exports.DocumentUpdaterTask = class DocumentUpdaterTask {
  constructor(list) {
    this.fileList = new Map(list.map(item => [item.relativePath, item]));
  }

  // TODO: delete documents that does not exist anymore or with updateDate or size changed
  // TODO: remove from list paths that are same (same path, updateDate, fileSize)
  async runStep() {

    logger.debug('Updating documents');

    const pathsToDelete = [];
    processCollection(pathsToDelete, 'images');
    processCollection(pathsToDelete, 'videos');
    processCollection(pathsToDelete, 'others');

    for(const item of pathsToDelete) {
      removePath(item);
    }

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

function removePath({ type, id, path }) {
  logger.info(`Deleting path '${path}'`);
}

'use strict';

const { createLogger, getStoreCollection } = require('mylife-tools-server');
const { FileProcessorTask } = require('./file-processor-task');

const logger = createLogger('mylife:gallery:sync:document-updater-task');

exports.DocumentUpdaterTask = class DocumentUpdaterTask {
  constructor(list) {
    this.list = list;
  }

  // TODO: delete documents that does not exist anymore or with updateDate or size changed
  // TODO: remove from list paths that are same (same path, updateDate, fileSize)
  async runStep() {
    return false;
  }

  createNextTask() {
    return new FileProcessorTask(this.list);
  }
};

function findDocument(path) {
  const image = findDocumentByType(path, 'images');
  if (image) {
    return image;
  }
  const video = findDocumentByType(path, 'videos');
  if (video) {
    return video;
  }
  const other = findDocumentByType(path, 'others');
  if (other) {
    return other;
  }
}

function findDocumentByType(path, type) {
  const collection = getStoreCollection(type);
  const [ item ] = collection.filter(item => item.paths.find(fsitem => fsitem.path === path));
  return item;
}

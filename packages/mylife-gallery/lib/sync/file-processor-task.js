'use strict';

const fs = require('fs').promises;
const crypto = require('crypto');
const { createLogger, getStoreCollection } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:file-processor-task');

exports.FileProcessorTask = class FileProcessorTask {
  constructor(list) {
    this.list = list;
  }

  async runStep() {
    const item = this.list.shift();

    try {
      await this.processFile(item);
    } catch(err) {
      logger.error(`Error processing file '${item.fullPath}': ${err.stack}`);
    }

    return !!this.list.length;
  }

  createNextTask() {
    return null;
  }

  async processFile({ fullPath, relativePath, updateDate, size }) {

    // look if it exists in collection. If so, skip it
    if (findDocument(relativePath)) {
      return;
    }

    logger.info(`Processing file '${relativePath}'`);
    const content = await fs.readFile(fullPath);
    const hash = createHash(content);

    console.log(fullPath, updateDate, size, hash);
  }
};

function createHash(content) {
  const hasher = crypto.createHash('sha1');
  hasher.update(content);
  return hasher.digest('hex');
}

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

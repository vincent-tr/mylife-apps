'use strict';

const fs = require('fs').promises;
const crypto = require('crypto');
const { createLogger } = require('mylife-tools-server');
const business = require('../business');

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

    logger.info(`Processing file '${relativePath}'`);
    const content = await fs.readFile(fullPath);
    const hash = createHash(content);

    const existingDocument = business.documentFindByHash(hash);
    if(existingDocument) {
      // only add the other path
      business.documentAddPath(existingDocument, relativePath);
      return;
    }

    // new document
    console.log(fullPath, updateDate, size, hash);
  }
};

function createHash(content) {
  const hasher = crypto.createHash('sha1');
  hasher.update(content);
  return hasher.digest('hex');
}

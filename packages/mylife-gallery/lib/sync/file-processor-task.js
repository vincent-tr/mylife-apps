'use strict';

const fs = require('fs').promises;
const crypto = require('crypto');
const { createLogger } = require('mylife-tools-server');

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

  async processFile({ fullPath, updateDate, size }) {
    // look if it exists in collection with same update date and same size. If so, skip it

    logger.info(`Processing file '${fullPath}'`);
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

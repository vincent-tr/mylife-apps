'use strict';

const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { createLogger, getConfig } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:task');

exports.SyncTask = class SyncTask {
  constructor() {
    this.current = new FsListTask();
  }

  async runStep() {
    const shouldContinue = await this.current.runStep();
    if(shouldContinue) {
      return true;
    }

    this.current = this.current.createNextTask();
    return !!this.current;
  }
};

class FsListTask {
  constructor() {
    this.started = false;
    this.pendingItems = [];
    this.pendingDirectories = [];
    this.list = [];
  }

  async runStep() {
    if(!this.started) {
      this.started = true;
      return this.start();
    }

    const nextItem = this.pendingItems.shift();
    if(nextItem) {
      await this.processItem(nextItem);
      return this.shouldContinue();
    }

    const nextDirectory = this.pendingDirectories.shift();
    if(nextDirectory) {
      await this.processDirectory(nextDirectory);
      return this.shouldContinue();
    }

    // should not be here
    return true;
  }

  createNextTask() {
    return new ProcessorTask(this.list);
  }

  shouldContinue() {
    const result = !!this.pendingItems.length || !!this.pendingDirectories.length;
    if(!result) {
      logger.debug(`Listing files done, ${this.list.length} items listed`);
    }
    return result;
  }

  async start() {
    const basePath = getConfig('gallery');
    logger.debug(`Listing files from '${basePath}'`);
    await this.processDirectory(basePath);
    return this.shouldContinue();
  }

  async processDirectory(directory) {
    const names = await fs.readdir(directory);
    for(const name of names) {
      const fullPath =  path.join(directory, name);
      this.pendingItems.push(fullPath);
    }
  }

  async processItem(fullPath) {
    const stats = await fs.lstat(fullPath);

    if(stats.isDirectory()) {
      this.pendingDirectories.push(fullPath);
      return;
    }

    this.list.push({ fullPath, updateDate: stats.mtime, size: stats.size });
  }
}

class ProcessorTask {
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
}

function createHash(content) {
  const hasher = crypto.createHash('sha1');
  hasher.update(content);
  return hasher.digest('hex');
}

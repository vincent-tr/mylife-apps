'use strict';

const path = require('path');
const fs = require('fs').promises;
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
    return null;
  }

  shouldContinue() {
    const result = this.pendingItems.length || this.pendingDirectories.length;
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
      const fullName =  path.join(directory, name);
      this.pendingItems.push(fullName);
    }
  }

  async processItem(fullName) {
    const stats = await fs.lstat(fullName);

    if(stats.isDirectory()) {
      this.pendingDirectories.push(fullName);
      return;
    }

    this.list.push({ path: fullName, updateDate: stats.mtime, size: stats.size });
  }
}

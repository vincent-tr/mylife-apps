import path from 'path';
import { promises as fs } from 'fs';
import { createLogger, getConfig } from 'mylife-tools-server';
import { DocumentUpdaterTask } from './document-updater-task';
import { Task } from './manager-task';

const logger = createLogger('mylife:gallery:sync:fs-list-task');

export class FsListTask implements Task {
  private started = false;
  private pendingItems: string[] = [];
  private pendingDirectories: string[] = [];
  private list: { fullPath; relativePath; fileUpdateDate; size }[] = [];

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
    return new DocumentUpdaterTask(this.list);
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

    const basePath = getConfig<string>('gallery');
    const relativePath = path.relative(basePath, fullPath);
    this.list.push({ fullPath, relativePath, fileUpdateDate: stats.mtime, size: stats.size });
  }
};

'use strict';

const { createLogger, getStoreCollection } = require('mylife-tools-server');
const { FileProcessorTask } = require('./file-processor-task');

const logger = createLogger('mylife:gallery:sync:document-remove-task');

exports.DocumentRemoveTask = class DocumentRemoveTask {
  constructor(list) {
    this.list = list;
  }

  // TODO: delete documents that does not exist anymore or with updateDate or size changed
  async runStep() {
    return false;
  }

  createNextTask() {
    return new FileProcessorTask(this.list);
  }
};

'use strict';

exports.SyncTask = class SyncTask {
  constructor() {
    this.count = 0;
  }

  async runStep() {
    console.log('run', this.count);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return ++this.count < 10;
  }
};

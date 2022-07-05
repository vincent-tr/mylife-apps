'use strict';

const { FsListTask } = require('./fs-list-task');

exports.ManagerTask = class ManagerTask {
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

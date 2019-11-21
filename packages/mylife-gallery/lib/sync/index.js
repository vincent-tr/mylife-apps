'use strict';

const { createLogger, registerService } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const { ManagerTask } = require('./manager-task');

const logger = createLogger('mylife:gallery:sync:server');

class SyncServer {
  async init() {
    this.timer = new Interval(() => this._run());

    this.running = null;
    this.stopping = false;

    logger.debug('Sync server started');
  }

  async terminate() {
    this.timer.stop();

    this.stopping = true;
    if(this.running) {
      await this.running;
    }

    logger.debug('Sync server stopped');
  }

  async _run() {
    if(this.running) {
      return;
    }

    const deferred = utils.defer();
    this.running = deferred.promise;

    logger.debug('Starting sync');
    const perf = new PerfTimer();

    try {
      const task = new ManagerTask();

      for(;;) {
        if(this.stopping) {
          logger.debug('Sync task interrupted because stopping');
          break;
        }

        if(!await task.runStep()) {
          break;
        }
      }

    } catch(err) {
      logger.error(err.stack);
    } finally {
      logger.debug(`Sync done in ${(perf.elapsed()).toFixed(3)}s`);

      this.running = null;
      deferred.resolve();
    }
  }
}

SyncServer.serviceName = 'sync-server';

registerService(SyncServer);

class Interval {
  constructor(callback) {
    this.timer = setInterval(callback, 60 * 10 * 1000);
  }

  stop() {
    clearInterval(this.timer);
  }
}

class PerfTimer {
  constructor() {
    this.startTime = Date.now();
  }

  elapsed() {
    const elapsedTime = Date.now() - this.startTime;
    return elapsedTime / 1000;
  }
}

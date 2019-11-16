'use strict';

const { createLogger, registerService } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:server');

const { sync } = require('./api');

class SyncServer {
  async init() {
    this._running = false;
    this._timer = setInterval(() => this._run(), 10 * 60 * 1000);
  }

  async terminate() {
    clearInterval(this._timer);
    this._timer = null;
    // TODO: must wait for/kill current run ?
  }

  async _run() {
    if(this._running) {
      return;
    }
    this._running = true;

    logger.debug('Starting sync');
    const startTime = Date.now();

    try {
      await sync();
    } catch(err) {
      logger.error(err.stack);
    } finally {
      const elapsedTime = Date.now() - startTime;
      logger.debug(`Sync done (${(elapsedTime / 1000).toFixed(3)})`);
      this._running = false;
    }
  }
}

SyncServer.serviceName = 'sync-server';

registerService(SyncServer);

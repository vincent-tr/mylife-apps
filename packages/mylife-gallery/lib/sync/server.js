'use strict';

const { createLogger } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:sync:server');

const { sync } = require('./index');

module.exports = class Server {
  constructor() {
    this._running = false;

    this._init();
  }

  async _init() {
    try {
      await this._run();
      this._timer = setInterval(() => this._run(), 10 * 60 * 1000);
    } catch(err) {
      logger.error(err.stack);
    }
  }

  async close() {
    clearInterval(this._timer);
    this._timer = null;
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
};

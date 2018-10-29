'use strict';

const debug = require('debug')('mylife:gallery:sync:server');

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
      console.error(err);
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

    debug('Starting sync');
    const startTime = Date.now();

    try {
      await sync();
    } catch(err) {
      console.error(err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      debug(`Sync done (${(elapsedTime / 1000).toFixed(3)})`);
      this._running = false;
    }
  }
};

'use strict';

const WebServer = require('./web/server');

module.exports = class Server {

  async init() {
    this._web = new WebServer();
  }

  async close() {
    await this._web.close();
    this._web = null;
  }
};

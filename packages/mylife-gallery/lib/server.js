'use strict';

const WebServer = require('./web/server');

module.exports = class Server {

  constructor(options) {
    this._web = new WebServer(options);
  }

  async close() {
    await this._web.close();
    this._web = null;
  }
};

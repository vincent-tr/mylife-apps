'use strict';

const WebServer = require('./web/server');
const { createRepository } = require('./repository');

module.exports = class Server {

  async init(options) {
    this._repository = await createRepository(options);
    this._web = new WebServer(options, this._repository);
  }

  async close() {
    await this._web.close();
    this._web = null;
    this._repository = null;
  }
};

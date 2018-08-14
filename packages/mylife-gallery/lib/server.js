'use strict';

const Database = require('./repository/database');
const WebServer = require('./web/server');
const SyncServer = require('./sync/server');

module.exports = class Server {

  async init(options) {
    this._repository = new Database();
    this._web = new WebServer(options, this._repository);
    this._sync = new SyncServer(options, this._repository);
  }

  async close() {
    await this._web.close();
    this._web = null;
    await this._sync.close();
    this._sync = null;
    this._repository = null;
  }
};

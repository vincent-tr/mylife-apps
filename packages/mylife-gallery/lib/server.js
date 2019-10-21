'use strict';

const config = require('./config');
const WebServer = require('./web/server');
const SyncServer = require('./sync/server');

module.exports = class Server {

  async init(options) {
    this._web = new WebServer(options);
    if(config.useSyncServer) {
      this._sync = new SyncServer();
    }
  }

  async close() {
    await this._web.close();
    this._web = null;

    if(this._sync) {
      await this._sync.close();
      this._sync = null;
    }
  }
};

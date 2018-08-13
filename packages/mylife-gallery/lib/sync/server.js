'use strict';

const debug = require('debug')('mylife:gallery:sync:server');

const { load } = require('./loader');
const database = require('./database');

module.exports = class Server {
  constructor(options, repository) {
    this._run(options, repository);
  }

  async _run(options, repository) {
    try {
      await load(options, repository);
      await database.save(options, repository);
    } catch(err) {
      console.error(err);
    }
  }

  async close() {
  }
};
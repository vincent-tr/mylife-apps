'use strict';

const debug = require('debug')('mylife:gallery:sync:server');

const { discover, load, unload } = require('./loader');
const database = require('./database');

module.exports = class Server {
  constructor(options, repository) {
    this._options = options;
    this._repository = repository;

    this._init();
  }

  async _init() {
    try {
      await database.load(this._options, this._repository);
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
    try {
      const discovery = await discover(this._options.gallery);
      const { added, removed } = diff(this._repository, discovery);
      if(!added.length && !removed.length) {
        return;
      }

      await unload(this._options.cache, this._repository, removed);
      await load(this._options.cache, this._repository, added);
      await database.save(this._options, this._repository);
    } catch(err) {
      console.error(err);
    }
  }
};

function repositoryKey(item) {
  return `${item.file.path}:${item.file.timestamp}`;
}

function discoveryKey(item) {
  return repositoryKey(item.props);
}

function diff(repository, discovery) {
  const repositoryIds = new Set(repository.list().map(repositoryKey));
  const discoveryIds = new Set(discovery.map(discoveryKey));

  return {
    added : discovery.filter(item => !repositoryIds.has(discoveryKey(item))),
    removed : repository.list().filter(item => !discoveryIds.has(repositoryKey(item)))
  };
}

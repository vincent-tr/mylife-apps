'use strict';

const debug = require('debug')('mylife:gallery:sync:server');

const { discover, load, unload } = require('./loader');
const database = require('./database');

module.exports = class Server {
  constructor(options, repository) {
    this._options = options;
    this._repository = repository;
    this._running = false;

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
    if(this._running) {
      return;
    }
    this._running = true;

    debug('Starting sync');
    const startTime = Date.now();

    try {
      await run(this._options, this._repository);
    } catch(err) {
      console.error(err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      debug(`Sync done (${(elapsedTime / 1000).toFixed(3)})`);
      this._running = false;
    }
  }
};

async function run(options, repository) {
  const discovery = await discover(options.gallery);
  const { added, removed } = diff(repository, discovery);
  if(!added.length && !removed.length) {
    return;
  }

  debug(`Found ${removed.length} items to remove, ${added.length} items to add`)

  await unload(options.cache, repository, removed);

  const addedChunks = chunks(added, 10);
  for(const [i, added] of addedChunks.entries()) {
    debug(`Processing item chunk to add ${i}/${addedChunks.length}`);
    await load(options.cache, repository, added);
    await database.save(options, repository);
  }
}

function key(item) {
  return `${item.file.path}:${item.file.timestamp}`;
}

function diff(repository, discovery) {
  const repositoryIds = new Set(repository.list().map(key));
  const discoveryIds = new Set(discovery.map(key));

  return {
    added : discovery.filter(item => !repositoryIds.has(key(item))),
    removed : repository.list().filter(item => !discoveryIds.has(key(item)))
  };
}

// https://stackoverflow.com/questions/8495687/split-array-into-chunks
function chunks(array, size) {
  const res = [];
  for (let i = 0, j = array.length; i < j; i += size) {
    res.push(array.slice(i, i + size));
  }
  return res;
}
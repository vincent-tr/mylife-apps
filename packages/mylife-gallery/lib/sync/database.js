'use strict';

const vfs = require('../vfs');
const debug = require('debug')('mylife:gallery:sync:database');

const FILENAME = 'metadata.json';

exports.load = async function(options, repository) {
  const directory = await vfs.FSEntry.load(options.cache);
  const file = await findEntry(directory, FILENAME);
  if(!file) {
    return;
  }

  debug('Loading database');
  const data = JSON.parse(await file.content());
  for(const props of data) {
    repository.addItem(props);
  }
  debug('Database loaded');
};

exports.save = async function(options, repository) {
  debug('Saving database');
  const directory = await vfs.FSEntry.load(options.cache);
  const data = JSON.stringify(repository.list(), null, 2);
  await directory.writeFile(FILENAME, data);
  debug('Database saved');
};

async function findEntry(directory, name) {
  for(const item of await directory.list()) {
    if(item.base === name) {
      return item;
    }
  }
}
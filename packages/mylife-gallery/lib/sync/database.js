'use strict';

const fs    = require('fs').promises;
const path  = require('path');
const debug = require('debug')('mylife:gallery:sync:database');

const FILENAME = 'metadata.json';

exports.load = async function(options, repository) {
  const content = await tryReadFile(path.join(options.cache, FILENAME));
  if(!content) {
    return;
  }

  debug('Loading database');
  const data = JSON.parse(content);
  for(const props of data) {
    repository.addItem(props);
  }
  debug('Database loaded');
};

exports.save = async function(options, repository) {
  debug('Saving database');
  const data = JSON.stringify(repository.list(), null, 2);
  await fs.writeFile(path.join(options.cache, FILENAME), data);
  debug('Database saved');
};

async function tryReadFile(path) {
  try {
    return await fs.readFile(path);
  } catch(err) {
    if(err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}


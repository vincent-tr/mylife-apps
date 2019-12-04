'use strict';

const { createLogger, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { utils } = require('mylife-tools-common');
const logger = createLogger('mylife:gallery:business:album');

exports.albumList = albumList;
function albumList() {
  return []; // TODO
}

exports.albumGet = (id) => {
  throw new Error('TODO');
};

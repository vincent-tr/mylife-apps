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

exports.albumCreate = (values) => {
  const entity = getMetadataEntity('album');
  const collection = getStoreCollection('albums');
  const newAlbum = entity.newObject(values);

  const item = collection.set(newAlbum);
  logger.info(`Created album '${item._id}'`);
  return item;
};

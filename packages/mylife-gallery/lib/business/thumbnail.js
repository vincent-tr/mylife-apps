'use strict';

const { createLogger, getDatabaseCollection, getService } = require('mylife-tools-server');
const logger = createLogger('mylife:gallery:business:thumbnail');

exports.thumbnailCreate = async (content) => {
  if(!content) {
    throw new Error('Cannot create empty thumbnail');
  }

  const collection = getDatabaseCollection('thumbnails');

  const id = newObjectID().toString();
  const record = { _id: newObjectID(id), content: newBinary(content) };

  logger.info(`Insert thumbnail (id: '${id}')`);
  await collection.insertOne(record);

  return id;
};

exports.thumbnailRemove = async (id) => {
  const collection = getDatabaseCollection('thumbnails');

  logger.info(`Delete thumbnail (id: '${id}')`);
  const result = await collection.deleteOne({ _id : newObjectID(id) });
  return !!result.deletedCount;
};

exports.thumbnailGet = async (id) => {
  const collection = getDatabaseCollection('thumbnails');

  const record = await collection.findOne({ _id : newObjectID(id) });
  if(!record) {
    throw new Error(`Thumbnail with id '${id}' not found`);
  }

  return record.content.buffer;
};

function newObjectID(id) {
  return getService('database').newObjectID(id);
}

function newBinary(data) {
  return getService('database').newBinary(data);
}

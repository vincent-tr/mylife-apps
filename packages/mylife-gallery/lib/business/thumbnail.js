'use strict';

const { createLogger, getDatabaseCollection, getService } = require('mylife-tools-server');
const logger = createLogger('mylife:gallery:business:thumbnail');
const business = require('.');

exports.thumbnailCreate = async (content) => {
  if(!content) {
    throw new Error('Cannot create empty thumbnail');
  }

  const collection = getThumbnailCollection();

  const id = newObjectID().toString();
  const record = { _id: newObjectID(id), content: newBinary(content) };

  logger.info(`Insert thumbnail (id: '${id}')`);
  await collection.insertOne(record);

  return id;
};

exports.thumbnailRemove = thumbnailRemove;
async function thumbnailRemove(id) {
  const collection = getThumbnailCollection();

  logger.info(`Delete thumbnail (id: '${id}')`);
  const result = await collection.deleteOne({ _id : newObjectID(id) });
  return !!result.deletedCount;
}

exports.thumbnailRemoveIfUnused = async (id) => {
  if(business.documentIsThumbnailUsed(id)) {
    return false;
  }
  if(business.albumIsThumbnailUsed(id)) {
    return false;
  }
  if(business.personIsThumbnailUsed(id)) {
    return false;
  }

  return await thumbnailRemove(id);
};

exports.thumbnailGet = async (id) => {
  const collection = getThumbnailCollection();

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

function getThumbnailCollection() {
  return getDatabaseCollection('thumbnails');
}

import { createLogger, getDatabaseCollection, getService } from 'mylife-tools-server';
import * as business from '.';

const logger = createLogger('mylife:gallery:business:thumbnail');

export async function thumbnailCreate(content) {
  if(!content) {
    throw new Error('Cannot create empty thumbnail');
  }

  const collection = getThumbnailCollection();

  const id = newObjectID().toString();
  const record = { _id: newObjectID(id), content: newBinary(content) };

  logger.info(`Insert thumbnail (id: '${id}')`);
  await collection.insertOne(record);

  return id;
}

export async function thumbnailRemove(id) {
  const collection = getThumbnailCollection();

  logger.info(`Delete thumbnail (id: '${id}')`);
  const result = await collection.deleteOne({ _id : newObjectID(id) });
  return !!result.deletedCount;
}

export async function thumbnailRemoveIfUnused(id) {
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
}

export async function thumbnailGet(id) {
  const collection = getThumbnailCollection();

  const record = await collection.findOne({ _id : newObjectID(id) });
  if(!record) {
    throw new Error(`Thumbnail with id '${id}' not found`);
  }

  return record.content.buffer;
}

function newObjectID(id?) {
  return getService('database').newObjectID(id);
}

function newBinary(data) {
  return getService('database').newBinary(data);
}

function getThumbnailCollection() {
  return getDatabaseCollection('thumbnails');
}

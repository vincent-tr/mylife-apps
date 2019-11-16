'use strict';

const { createLogger, getDatabaseCollection, getService } = require('mylife-tools-server');
const logger = createLogger('mylife:gallery:repository:data');

exports.get = async function get(name, id) {
  const [ object ] = await find(name, { _id : id });
  return object;
};

exports.set = async function set(name, object) {
  const collection = getDatabaseCollection(name);

  if(object._id) {
    logger.info(`Update ${name} (id: ${object._id})`);
    return await collection.replaceOne({ _id : object._id }, object);
  }

  const result = await collection.insertOne(object);
  logger.info(`Insert ${name} (id: ${object._id})`);
  return result;
};

exports.delete = async function delete_(name, id) {
  const collection = getDatabaseCollection(name);

  logger.info(`Delete ${name} (id: ${id})`);
  return await collection.deleteOne({ _id : id });
};

exports.find = find;
async function find(name, query, options) {
  const collection = getDatabaseCollection(name);

  logger.debug(`Find ${name} (query: ${JSON.stringify(query)}, options: ${JSON.stringify(options)})`);
  const objects = await collection.find(query, options);
  return await objects.toArray();
}

exports.wrapObjectID = function wrapObjectID(value) {
  getService('database').newObjectID(value);
};

exports.wrapBinary = function wrapBinary(buffer) {
  getService('database').newBinary(buffer);
};

exports.unwrapBinary = function unwrapBinary(binary) {
  return binary && binary.buffer;
};

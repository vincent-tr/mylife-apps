'use strict';

const { URL }                   = require('url');
const { MongoClient, ObjectID } = require('mongodb');
const debug                     = require('debug')('mylife:gallery:repository:data');
const config                    = require('../../conf/config');

let client = null;
let db = null;

async function checkDb() {
  const dbUrl = config.mongo;
  let dbName;

  function getDbName() {
    if(!dbName) {
      dbName = new URL(dbUrl).pathname.substring(1);
    }
    return dbName;
  }

  if(!client) {
    db = null;
    client = new MongoClient(dbUrl, { useNewUrlParser: true });
  }

  if(!client.isConnected()) {
    db = null;
    debug(`Connecting to ${dbUrl} (database: ${getDbName()})`);
    await client.connect();
  }

  if(!db) {
    db = client.db(getDbName());
  }
}

exports.close = async function close() {
  if(!client) { return; }
  await client.close();
  client = null;
};

exports.get = async function get(name, id) {
  const [ object ] = await find(name, { _id : id });
  return object;
};

exports.set = async function set(name, object) {
  await checkDb();
  const collection = db.collection(name);

  if(object._id) {
    debug(`Update ${name} (id: ${object._id})`);
    return await collection.replaceOne({ _id : object._id }, object);
  }

  debug(`Insert ${name} (id: ${object._id})`);
  object._id = new ObjectID();
  return await collection.insertOne(object);
};

exports.delete = async function delete_(name, id) {
  await checkDb();
  const collection = db.collection(name);

  debug(`Delete ${name} (id: ${id})`);
  return await collection.deleteOne({ _id : id });
};

exports.find = find;
async function find(name, query, options) {
  await checkDb();
  const collection = db.collection(name);

  debug(`Find ${name} (query: ${JSON.stringify(query)}, options: ${JSON.stringify(options)})`);
  const objects = await collection.find(query, options);
  return await objects.toArray();
}

exports.wrapObjectID = function wrapObjectID(value) {
  return new ObjectID(value);
};

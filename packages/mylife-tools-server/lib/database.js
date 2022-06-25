'use strict';

const { URL } = require('url');
const { MongoClient, ObjectID, Binary, GridFSBucket } = require('mongodb');

const { createLogger } = require('./logging');
const { getConfig } = require('./config');
const { registerService, getService } = require('./service-manager');

const logger = createLogger('mylife:tools:server:database');

exports.dbObjects = { ObjectID, Binary };

// http://mongodb.github.io/node-mongodb-native/3.2/
// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html

class Database {
  async init({ url = getConfig('mongo')} = {}) {
    const mongoLogger = {
      debug: (...args) => logger.debug(...args),
      log: (...args) => logger.info(...args),
      error: (...args) => logger.error(...args)
    };

    const options = {
      logger: mongoLogger,
      directConnection: true,
    };

    this._client = await MongoClient.connect(url, options);

    const dbName = new URL(url).pathname.substring(1);
    this._db = this._client.db(dbName);

    this._session = this._client.startSession();

    logger.info(`Connected to ${url} (database=${dbName})`);
  }

  async terminate() {
    await this._session.endSession();
    await this._client.close();
    this._client = null;
    this._db = null;
    this._session = null;
    logger.info('Close database');
  }

  collection(name) {
    return this._db.collection(name);
  }

  session() {
    return this._session;
  }

  gridFSBucket(name, options) {
    return new GridFSBucket(this._db, { bucketName : name, ...options });
  }

  newObjectID(id) {
    return new ObjectID(id);
  }

  newBinary(data) {
    return new Binary(data);
  }
}

Database.serviceName = 'database';

registerService(Database);

exports.getDatabaseCollection = (name) => getService('database').collection(name);

import { URL } from 'url';
import { MongoClient, ObjectID, Binary, GridFSBucket, MongoClientOptions, Logger } from 'mongodb';

import { createLogger } from './logging';
import { getConfig } from './config';
import { registerService, getService } from './service-manager';

const logger = createLogger('mylife:tools:server:database');

export const dbObjects = { ObjectID, Binary };

// http://mongodb.github.io/node-mongodb-native/3.2/
// https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html

class Database {
  private client;
  private db;
  private _session;

  async init({ url = getConfig<string>('mongo')} = {}) {
    const mongoLogger = {
      debug: (message: string, meta?: unknown) => logger.debug(message, meta),
      warn: (message: string, meta?: unknown) => logger.warn(message, meta),
      info: (message: string, meta?: unknown) => logger.info(message, meta),
      error: (message: string, meta?: unknown) => logger.error(message, meta)
    };

    const options: MongoClientOptions = {
      logger: mongoLogger as unknown as Logger,
      directConnection: true,
    };

    this.client = await MongoClient.connect(url, options);

    const dbName = new URL(url).pathname.substring(1);
    this.db = this.client.db(dbName);

    this._session = this.client.startSession();

    logger.info(`Connected to ${url} (database=${dbName})`);
  }

  async terminate() {
    await this._session.endSession();
    await this.client.close();
    this.client = null;
    this.db = null;
    this._session = null;
    logger.info('Close database');
  }

  collection(name: string) {
    return this.db.collection(name);
  }

  session() {
    return this._session;
  }

  gridFSBucket(name: string, options) {
    return new GridFSBucket(this.db, { bucketName : name, ...options });
  }

  newObjectID(id: string) {
    return new ObjectID(id);
  }

  newBinary(data) {
    return new Binary(data);
  }

  static readonly serviceName = 'database';
}

registerService(Database);

export function getDatabaseCollection(name: string) {
  return getService('database').collection(name);
}

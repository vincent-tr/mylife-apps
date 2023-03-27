import { createLogger } from '../logging';
import { registerService, getService, fatal } from '../service-manager';
import { Container, Event } from './container';
import { Collection, Index, PartitionIndex, SortIndex } from './collection';
import { View } from './view';
import { MaterializedView } from './materialized-view';
import { deserializeObject, serializeObject, serializeObjectId, deserializeObjectId } from './serializer';

const logger = createLogger('mylife:tools:server:store');

type FIXME_any = any;

async function bindCollection(collection) {
  logger.info(
    `loading database collection '${collection.name}' (entity='${collection.entity.id}', databaseCollection='${collection.databaseCollection.collectionName}')`
  );
  const cursor = collection.databaseCollection.find({});
  await cursor.forEach((record) => {
    const object = deserializeObject(record, collection.entity);
    collection.load(object);
  });

  collection.databaseChangeStream = collection.databaseCollection.watch(null, { fullDocument: 'updateLookup' });
  collection.databaseChangeStream.on('change', (change) => handleChange(collection, change));

  collection.databaseUpdating = false;
}

async function unbindCollection(collection) {
  await collection.databaseChangeStream.close();
  collection.databaseChangeStream = null;
}

function handleChange(collection, change) {
  const session = getService('database').session();
  if (change.lsid && areSessionIdsEqual(session.id, change.lsid)) {
    logger.debug('Got change with same session id than current session, ignored');
    return;
  }

  try {
    const id = getChangedDocumentId(collection, change);
    logger.debug(`Database collection '${collection.name}' change (id='${id}', type='${change.operationType}')`);

    switch (change.operationType) {
      case 'insert':
      case 'replace':
      case 'update': {
        const record = change.fullDocument;
        const object = deserializeObject(record, collection.entity);

        collection.databaseUpdating = true;
        collection.set(object);
        collection.databaseUpdating = false;
        break;
      }

      case 'delete': {
        collection.databaseUpdating = true;
        collection.delete(id);
        collection.databaseUpdating = false;
        break;
      }

      case 'drop':
      case 'rename':
      case 'dropDatabase':
      case 'invalidate':
      default:
        throw new Error(`Unhandled database change stream operation type: '${change.operationType}`);
    }
  } catch (err) {
    // it is a fatal error if we could not handle database notifications properly
    fatal(err);
  }
}

function areSessionIdsEqual(sessionId1, sessionId2) {
  return sessionId1.id.buffer.equals(sessionId2.id.buffer);
}

function getChangedDocumentId(collection, change) {
  const objectId = change.documentKey && change.documentKey._id;
  return objectId && deserializeObjectId(collection.entity, objectId);
}

function registerDatabaseUpdater(collection) {
  collection.on('change', (event) => {
    if (collection.databaseUpdating) {
      return; // do not persist if we are triggered from database update
    }

    const taskQueue = getService('task-queue-manager').getQueue('store');
    taskQueue.add(`${collection.name}/${event.type}`, async () => {
      try {
        await databaseUpdate(collection, event);
      } catch (err) {
        // it is a fatal error if background database update fails
        fatal(err);
      }
    });
  });
}

async function databaseUpdate(collection, { before, after, type }) {
  const databaseCollection = collection.databaseCollection;
  const session = getService('database').session();
  await session.withTransaction(async () => {
    switch (type) {
      case 'create': {
        const record = serializeObject(after, collection.entity);
        await databaseCollection.insertOne(record, { session });
        break;
      }

      case 'update': {
        const record = serializeObject(after, collection.entity);
        await databaseCollection.replaceOne({ _id: record._id }, record, { session });
        break;
      }

      case 'remove': {
        const id = serializeObjectId(before, collection.entity);
        await databaseCollection.deleteOne({ _id: id }, { session });
        break;
      }

      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  });
}

class Store {
  private readonly collections = new Map<string, Collection>();
  private readonly materializedViews = new Map<string, FIXME_any>();

  async init({ storeConfiguration }) {
    if (!storeConfiguration) {
      throw new Error('no store configuration');
    }

    getService('task-queue-manager').createQueue('store');

    for (const collectionConfiguration of storeConfiguration.filter(item => !!item.collection)) {
      const { collection: name, entity: entityId = name, database: databaseName = name, indexes } = collectionConfiguration;

      const entity = getService('metadata-manager').getEntity(entityId);
      const databaseCollection = getService('database').collection(databaseName);
      const collection = new Collection(name, databaseCollection, entity);
      this.collections.set(name, collection);

      await bindCollection(collection);

      for (const index of indexes) {
        collection.setupIndex(index);
      }

      registerDatabaseUpdater(collection);
    }

    for (const materializedViewConfiguration of storeConfiguration.filter(item => !!item.materializedView)) {
      const { materializedView: name, factory } = materializedViewConfiguration;

      logger.info(`loading materialized view '${name}'`);
      const view = factory();
    
      this.materializedViews.set(name, view);
    }
  }

  async terminate() {
    await getService('task-queue-manager').closeQueue('store');

    for (const collection of this.collections.values()) {
      await unbindCollection(collection);
    }

    for (const view of this.materializedViews.values()) {
      view.close();
    }

    this.materializedViews.clear();
  }

  collection(name: string) {
    const result = this.collections.get(name);
    if (result) {
      return result;
    }

    throw new Error(`Collection does not exist: '${name}'`);
  }

  materializedView(name: string) {
    const result = this.materializedViews.get(name);
    if (result) {
      return result;
    }

    throw new Error(`Materialized view does not exist: '${name}'`);
  }

  deserializeObject(record, entity) {
    return deserializeObject(record, entity);
  }

  serializeObject(object, entity) {
    return serializeObject(object, entity);
  }

  static readonly serviceName = 'store';
  static readonly dependencies = ['metadata-manager', 'database', 'task-queue-manager'];
}

registerService(Store);

export function getStoreCollection(name: string) {
  return getService('store').collection(name);
}

export function getStoreMaterializedView(name: string) {
  return getService('store').materializedView(name);
}

export { View as StoreView };
export { Container as StoreContainer };
export { Collection as StoreCollection, Index as StoreIndex, PartitionIndex as StorePartitionIndex, SortIndex as StoreSortIndex };
export { MaterializedView as StoreMaterializedView };
export { Event as StoreEvent };

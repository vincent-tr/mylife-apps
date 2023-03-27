import { getService } from '../service-manager';
import { View } from './view';
import { Container } from './container';

export interface IndexConfiguration {
  readonly name: string;
  readonly type: 'partition' | 'sort';
}

export class Collection extends Container {
  private readonly indexes = new Map<string, Index>();

  constructor(name: string, public readonly databaseCollection, public readonly entity) {
    super(name);
  }

  setupIndex(configuration: IndexConfiguration) {
    const { name } = configuration;
    const index = createIndex(this, configuration);
    this.indexes.set(name, index);
  }

  load(object) {
    this._set(object);
  }

  set(object) {
    if(object._entity !== this.entity.id) {
      throw new Error(`Cannot set object of entity '${object._entity}' on collection '${this.name}', expected '${this.entity.id}' entity type`);
    }

    let id = object._id;
    if(!id) {
      id = this.newId();
      object = this.entity.getField('_id').setValue(object, id);
    }

    this._set(object);

    return object;
  }

  delete(id) {
    return this._delete(id);
  }

  createView(filterCallback = () => true) {
    const view = new View(this);
    view.setFilter(filterCallback);
    return view;
  }

  newId() {
    return getService('database').newObjectID().toString();
  }

  getIndex(name: string) {
    const index = this.indexes.get(name);
    if (!index) {
      throw new Error(`Index '${name}' does not exist`);
    }

    return index;
  }
};

function createIndex(collection: Collection, configuration: IndexConfiguration) {
  const { type } = configuration;
  switch (type) {
    case 'partition':
      return new PartitionIndex(collection, configuration as PartitionIndexConfiguration);
    case 'sort':
      return new SortIndex(collection, configuration as SortIndexConfiguration);
    default:
      throw new Error(`Unknown index type: '${type}'`);
  }
}

type FIXME_record = any;
type PartitionKey = any;
type KeyBuilder = (record: FIXME_record) => PartitionKey;

export class Index {
}

interface PartitionIndexConfiguration extends IndexConfiguration {
  readonly keyBuilder: KeyBuilder;
}

export class PartitionIndex extends Index {
  private readonly partitions = new Map<any, Set<FIXME_record>>();
  private readonly buildKey: KeyBuilder;

  constructor(collection: Collection, configuration: PartitionIndexConfiguration) {
    super();

    this.buildKey = configuration.keyBuilder;

    collection.on('change', this.onCollectionChange);

    for (const object of collection.list()) {
      this.onCollectionChange({ before: null, after: object, type: 'create' });
    }
  }

  private readonly onCollectionChange = ({ before, after, type }) => {
    switch(type) {
      case 'create': {
        this.addToPartition(after);
        break;
      }
  
      case 'update': {
        // add new object before removing old one, so that if it stays in the same partition
        // and is the only one in the partition, the partition is not deleted and recreated
        this.addToPartition(after);
        this.removeFromPartition(before);
        break;
      }
  
      case 'remove': {
        this.removeFromPartition(before);
        break;
      }
  
      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  };

  private addToPartition(object: FIXME_record) {
    const key = this.buildKey(object);

    let partition = this.partitions.get(key);
    if (!partition) {
      partition = new Set<FIXME_record>();
      this.partitions.set(key, partition);
    }

    partition.add(object);
  }

  private removeFromPartition(object: FIXME_record) {
    const key = this.buildKey(object);

    const partition = this.partitions.get(key);
    partition.delete(object);

    if (partition.size === 0) {
      this.partitions.delete(key);
    }
  }

  // Note: caller should not modify returned Set
  findPartition(key: PartitionKey) {
    return this.partitions.get(key);
  }
}

interface SortIndexConfiguration extends IndexConfiguration {
  readonly recordComparer: (a: FIXME_record, b: FIXME_record) => number; // -1 if a < b, 1 if 1 > b, 0 if equals
}

export class SortIndex extends Index {
  constructor(collection: Collection, configuration: SortIndexConfiguration) {
    super();

    throw new Error('TODO');
  }
}
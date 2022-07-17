import { getStoreCollection, notifyView, StoreCollection, StoreContainer, StoreEvent } from 'mylife-tools-server';
import * as business from '.';

export function keywordsNotify(session) {
  const view = new KeywordView();
  return notifyView(session, view);
}

class KeywordView extends StoreContainer {
  private readonly keywordsRefCount = new Map();
  private subscriptions;
  private collections: { [name: string]: StoreCollection };

  constructor() {
    super('keyword-view');

    this.createSubscriptions();
  }

  private createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    const collections = [...business.getDocumentStoreCollections(), getStoreCollection('albums')];
    for(const collection of collections) {
      const subscription = new business.CollectionSubscription(this, collection, (event) => this.onCollectionChange(event));
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  refresh() {
    for(const collection of Object.values(this.collections)) {
      for(const object of collection.list()) {
        this.onCollectionChange({ type: 'create', after: object });
      }
    }
  }

  keywordRef(value) {
    const refCount = this.keywordsRefCount.get(value);
    if(refCount) {
      ++refCount.count;
      return;
    }

    this.keywordsRefCount.set(value, { count: 1 });
    this._set({ _id: value });
  }

  keywordUnref(value) {
    const refCount = this.keywordsRefCount.get(value);
    if(!refCount) {
      return; // ??
    }

    --refCount.count;
    if(!refCount.count) {
      this.keywordsRefCount.delete(value);
      this._delete(value);
    }
  }

  private onCollectionChange({ before, after, type }: StoreEvent) {
    switch(type) {
      case 'create': {
        for(const keyword of after.keywords) {
          this.keywordRef(keyword);
        }
        break;
      }

      case 'update': {
        const beforeKw = new Set(before.keywords);
        const afterKw = new Set(after.keywords);

        for(const keyword of before.keywords) {
          if(!afterKw.has(keyword)) {
            this.keywordUnref(keyword);
          }
        }

        for(const keyword of after.keywords) {
          if(!beforeKw.has(keyword)) {
            this.keywordRef(keyword);
          }
        }
        break;
      }

      case 'remove': {
        for(const keyword of before.keywords) {
          this.keywordUnref(keyword);
        }
        break;
      }


      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }
}

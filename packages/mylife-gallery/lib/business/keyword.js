'use strict';

const { getStoreCollection, notifyView, StoreContainer } = require('mylife-tools-server');
const business = require('.');

exports.keywordsNotify = (session) => {
  const view = new KeywordView();
  return notifyView(session, view);
};

class KeywordView extends StoreContainer {
  constructor() {
    super();
    this._createSubscriptions();
    this._keywordsRefCount = new Map();
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    const collections = [...business.getDocumentStoreCollections(), getStoreCollection('albums')];
    for(const collection of collections) {
      const subscription = new business.CollectionSubscription(this, collection);
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
        this.onCollectionChange(collection, { type: 'create', after: object });
      }
    }
  }

  keywordRef(value) {
    const refCount = this._keywordsRefCount.get(value);
    if(refCount) {
      ++refCount.count;
      return;
    }

    this._keywordsRefCount.set(value, { count: 1 });
    this._set({ _id: value });
  }

  keywordUnref(value) {
    const refCount = this._keywordsRefCount.get(value);
    if(!refCount) {
      return; // ??
    }

    --refCount.count;
    if(!refCount.count) {
      this._keywordsRefCount.delete(value);
      this._delete(value);
    }
  }

  onCollectionChange(collection, { before, after, type }) {
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
        for(const keyword of after.keywords) {
          this.keywordUnref(keyword);
        }
        break;
      }


      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }
}

'use strict';

const { notifyView, StoreContainer } = require('mylife-tools-server');
const business = require('.');

exports.documentNotify = (session, type, id) => {
  const collection = business.getDocumentStoreCollection(type);
  return notifyView(session, collection.createView(document => document._id === id));
};

exports.documentsNotify = (session, criteria) => {
  const view = new DocumentView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

class DocumentView extends StoreContainer {
  constructor() {
    super();
    this._createSubscriptions();
  }

  _createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for(const collection of business.getDocumentStoreCollections()) {
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

  setCriteria(criteria) {
    this._criteria = criteria;
    this.refresh();
  }

  refresh() {
    for(const collection of Object.values(this.collections)) {
      for(const object of collection.list()) {
        this._onCollectionChange(collection, { type: 'update', before: object, after: object });
      }
    }
  }

  _onCollectionChange(collection, { before, after, type }) {
    switch(type) {
      case 'create': {
        if(this._filter(after)) {
          this._set(after);
        }
        break;
      }

      case 'update': {
        if(this._filter(after)) {
          this._set(after);
        } else {
          this._delete(before._id);
        }
        break;
      }

      case 'remove': {
        this._delete(before._id);
        break;
      }


      default:
        throw new Error(`Unsupported event type: '${type}'`);
    }
  }

  _filter(document) {
    // TODO
    return true;
  }
}

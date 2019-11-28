'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity, notifyView } = require('mylife-tools-server');
const business = require('.');

class CollectionSubscription {
  constructor(view, collectionName) {
    this.view = view;
    this.collection = getStoreCollection(collectionName);
    this.changeCallback = event => this.view._onCollectionChange(this.collection, event);
    this.collection.on('change', this.changeCallback);
  }

  unsubscribe() {
    this.collection.off('change', this.changeCallback);
  }
}

class StatsView extends StoreContainer {
  constructor() {
    super();

    this._createSubscriptions('images', 'videos', 'others');
    this._createIds('image-count', 'video-count', 'other-count', 'last-integration');

    this.entity = getMetadataEntity('stat');
    this._onCollectionChange();
  }

  _createSubscriptions(...collectionNames) {
    this.subscriptions = [];
    this.collections = {};

    for(const collectionName of collectionNames) {
      const subscription = new CollectionSubscription(this, collectionName);
      this.subscriptions.push(subscription);
      this.collections[collectionName] = subscription.collection;
    }
  }

  _createIds(...codes) {
    this.ids = {};
    for(const code of codes) {
      this.ids[code] = this._newId();
    }
  }

  _newId() {
    return this.subscriptions[0].collection.newId();
  }

  close() {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this._reset();
  }

  refresh() {
    this._onCollectionChange();
  }

  _onCollectionChange() {
    this._setValue('image-count', this.collections.images.size);
    this._setValue('video-count', this.collections.videos.size);
    this._setValue('other-count', this.collections.others.size);
    this._setValue('last-integration', findLastIntegration());
  }

  _setObject(values) {
    this._set(this.entity.newObject(values));
  }

  _setValue(code, value) {
    this._set(this.entity.newObject({ _id: this.ids[code], code, value }));
  }
}


function findLastIntegration() {
  const documents = business.documentList();
  const result = documents.reduce((acc, doc) => Math.max(acc, doc.integrationDate), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

exports.statsNotify = session => {
  const view = new StatsView();
  return notifyView(session, view);
};

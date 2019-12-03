'use strict';

const { StoreContainer, getMetadataEntity, notifyView } = require('mylife-tools-server');
const business = require('.');

class StatsView extends StoreContainer {
  constructor() {
    super();

    this._createSubscriptions();
    this._createIds('image-count', 'video-count', 'other-count', 'last-integration');

    this.entity = getMetadataEntity('stat');
    this.onCollectionChange();
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
    this.onCollectionChange();
  }

  onCollectionChange() {
    this._setValue('image-count', this.collections.image.size);
    this._setValue('video-count', this.collections.video.size);
    this._setValue('other-count', this.collections.other.size);
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

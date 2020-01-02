'use strict';

const { StoreContainer, getMetadataEntity, notifyView } = require('mylife-tools-server');
const business = require('.');

class StatsView extends StoreContainer {
  constructor() {
    super();

    this._createSubscriptions();
    this._createIds(
      'image-count', 'image-file-size', 'image-media-size',
      'video-count', 'video-file-size', 'video-media-size',
      'other-count', 'other-file-size',
      'last-integration');

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
    this._setValue('image-file-size', this.collections.image.list().reduce((acc, item) => acc + item.fileSize, 0));
    this._setValue('image-media-size', this.collections.image.list().reduce((acc, item) => acc + item.media.size, 0));
    this._setValue('video-count', this.collections.video.size);
    this._setValue('video-file-size', this.collections.video.list().reduce((acc, item) => acc + item.fileSize, 0));
    this._setValue('video-media-size', this.collections.video.list().reduce((acc, item) => acc + item.media.size, 0));
    this._setValue('other-count', this.collections.other.size);
    this._setValue('other-file-size', this.collections.other.list().reduce((acc, item) => acc + item.fileSize, 0));
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

import { StoreContainer, getMetadataEntity, notifyView } from 'mylife-tools-server';
import * as business from '.';

class StatsView extends StoreContainer {
  private entity;
  private subscriptions;
  private collections;
  private ids;

  constructor() {
    super('stats-view');

    this.createSubscriptions();
    this.createIds(
      'image-count', 'image-file-size', 'image-media-size',
      'video-count', 'video-file-size', 'video-media-size',
      'other-count', 'other-file-size',
      'last-integration');

    this.entity = getMetadataEntity('stat');
    this.onCollectionChange();
  }

  private createSubscriptions() {
    this.subscriptions = [];
    this.collections = {};

    for(const collection of business.getDocumentStoreCollections()) {
      const subscription = new business.CollectionSubscription(this, collection, (event) => this.onCollectionChange());
      this.subscriptions.push(subscription);
      this.collections[collection.entity.id] = collection;
    }
  }

  private createIds(...codes) {
    this.ids = {};
    for(const code of codes) {
      this.ids[code] = this.newId();
    }
  }

  private newId() {
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

  private onCollectionChange() {
    this.setValue('image-count', this.collections.image.size);
    this.setValue('image-file-size', this.collections.image.list().reduce((acc, item) => acc + item.fileSize, 0));
    this.setValue('image-media-size', this.collections.image.list().reduce((acc, item) => acc + item.media.size, 0));
    this.setValue('video-count', this.collections.video.size);
    this.setValue('video-file-size', this.collections.video.list().reduce((acc, item) => acc + item.fileSize, 0));
    this.setValue('video-media-size', this.collections.video.list().reduce((acc, item) => acc + item.media.size, 0));
    this.setValue('other-count', this.collections.other.size);
    this.setValue('other-file-size', this.collections.other.list().reduce((acc, item) => acc + item.fileSize, 0));
    this.setValue('last-integration', findLastIntegration());
  }

  private setObject(values) {
    this._set(this.entity.newObject(values));
  }

  private setValue(code, value) {
    this._set(this.entity.newObject({ _id: this.ids[code], code, value }));
  }
}


function findLastIntegration() {
  const documents = business.documentList();
  const result = documents.reduce((acc, doc) => Math.max(acc, doc.integrationDate), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

export function statsNotify(session) {
  const view = new StatsView();
  return notifyView(session, view);
}

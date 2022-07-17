'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

export class OperationStats extends StoreContainer {
  private readonly collection;
  private readonly changeCallback;
  private readonly countId;
  private readonly lastDateId;
  private readonly entity;

  constructor() {
    super();
    this.collection = getStoreCollection('operations');

    this.changeCallback = () => this.onCollectionChange();
    this.collection.on('change', this.changeCallback);

    this.countId = this.collection.newId();
    this.lastDateId = this.collection.newId();
    this.entity = getMetadataEntity('report-operation-stat');

    this.onCollectionChange();
  }

  refresh() {
    this.onCollectionChange();
  }

  private onCollectionChange() {
    this.setObject({ _id: this.countId, code: 'count', value: this.collection.size });
    this.setObject({ _id: this.lastDateId, code: 'lastDate', value: findLastDate(this.collection.list()) });
  }

  private setObject(values) {
    this._set(this.entity.newObject(values));
  }

  close() {
    this.collection.off('change', this.changeCallback);
    this._reset();
  }
}

function findLastDate(operations) {
  const result = operations.reduce((acc, op) => Math.max(acc, op.date), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

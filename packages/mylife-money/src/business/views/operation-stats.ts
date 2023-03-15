'use strict';

const { StoreMaterializedView, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

export class OperationStats extends StoreMaterializedView {
  private readonly collection;
  private readonly countId: string;
  private readonly lastDateId: string;
  private readonly unsortedCountId: string;

  constructor() {
    super('operation-stats', getMetadataEntity('report-operation-stat'));
    this.collection = getStoreCollection('operations');
    this.collection.on('change', this.onCollectionChange);

    this.countId = this.collection.newId();
    this.lastDateId = this.collection.newId();
    this.unsortedCountId = this.collection.newId();

    this.onCollectionChange();
  }

  private readonly onCollectionChange = () => {
    this.setObject({ _id: this.countId, code: 'count', value: this.collection.size });
    this.setObject({ _id: this.lastDateId, code: 'lastDate', value: findLastDate(this.collection.list()) });
    this.setObject({ _id: this.unsortedCountId, code: 'unsortedCount', value: computeUnsortedCount(this.collection.list()) });
  };

  private setObject(values) {
    this._set(this.entity.newObject(values));
  }

  close() {
    this.collection.off('change', this.onCollectionChange);
    this._reset();
  }
}

function findLastDate(operations) {
  const result = operations.reduce((acc, op) => Math.max(acc, op.date), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

function computeUnsortedCount(operations) {
  const currentYear = new Date().getFullYear();
  return operations.filter(op => op.date.getFullYear() === currentYear && op.group === null).length;
}
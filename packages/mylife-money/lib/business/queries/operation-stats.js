'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

exports.OperationStats = class OperationStats extends StoreContainer {
  constructor() {
    super();
    this.collection = getStoreCollection('operations');

    this._changeCallback = event => this._onCollectionChange(event);
    this.collection.on('change', this._changeCallback);

    this._countId = this.collection.newId();
    this._lastDateId = this.collection.newId();
    this.entity = getMetadataEntity('report-operation-stat');

    this._onCollectionChange();
  }

  refresh() {
    this._onCollectionChange();
  }

  _onCollectionChange() {
    this._setObject({ _id: this._countId, code: 'count', value: this.collection.size });
    this._setObject({ _id: this._lastDateId, code: 'lastDate', value: findLastDate(this.collection.list()) });
  }

  _setObject(values) {
    this._set(this.entity.newObject(values));
  }

  close() {
    this.collection.off('change', this._changeCallback);
    this._reset();
  }
};

function findLastDate(operations) {
  const result = operations.reduce((acc, op) => Math.max(acc, op.date), -Infinity);
  return isFinite(result) ? new Date(result) : null;
}

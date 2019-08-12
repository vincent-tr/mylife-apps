'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { dateToMonth, roundCurrency, monthRange } = require('./tools');

exports.TotalByMonth = class TotalByMonth extends StoreContainer {
  constructor() {
    super();
    this.collection = getStoreCollection('operations');

    this._changeCallback = event => this._onCollectionChange(event);
    this.collection.on('change', this._changeCallback);

    this._skeletons = createSkeletons(this.collection);
    this._lastDateId = this.collection.newId();
    this.entity = getMetadataEntity('report-total-by-month');

    this._onCollectionChange();
  }

  refresh() {
    this._onCollectionChange();
  }

  _onCollectionChange() {
    const objects = new Map();
    for(const skeleton of this._skeletons) {
      const object = { ... skeleton };
      objects.set(object.month, skeleton);
    }

    for(const operation of this.collection.list()) {
      const month = dateToMonth(operation.date);
      const object = objects.get(month);
      if(!object) {
        continue;
      }

      ++object.count;
      operation.amount < 0 ? (object.sumDebit += -operation.amount) : (object.sumCredit += operation.amount);
      object.balance += operation.amount;
    }

    for(const object of objects.values()) {
      object.sumDebit = roundCurrency(object.sumDebit);
      object.sumCredit = roundCurrency(object.sumCredit);
      object.balance = roundCurrency(object.balance);

      this._set(this.entity.newObject(object));
    }
  }

  close() {
    this.collection.off('change', this._changeCallback);
    this._reset();
  }
};

function createSkeletons(col) {
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, 0, 1);

  return monthRange(minDate, now).map(month => ({
    _id: col.newId(),
    month,
    count: 0,
    sumDebit: 0,
    sumCredit: 0,
    balance: 0
  }));
}

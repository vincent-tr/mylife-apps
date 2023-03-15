'use strict';

const { StoreMaterializedView, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { dateToMonth, roundCurrency, monthRange } = require('./tools');

export class TotalByMonth extends StoreMaterializedView {
  private readonly collection;
  private readonly skeletons;

  constructor() {
    super('total-by-month', getMetadataEntity('report-total-by-month'));
    this.collection = getStoreCollection('operations');
    this.collection.on('change', this.onCollectionChange);

    this.skeletons = createSkeletons();

    this.onCollectionChange();
  }

  private readonly onCollectionChange = () => {
    const objects = new Map();
    for(const skeleton of this.skeletons) {
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
  };

  close() {
    this.collection.off('change', this.onCollectionChange);
    this._reset();
  }
}

function createSkeletons() {
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 1, 0, 1);

  return monthRange(minDate, now).map(month => ({
    _id: month,
    month,
    count: 0,
    sumDebit: 0,
    sumCredit: 0,
    balance: 0
  }));
}

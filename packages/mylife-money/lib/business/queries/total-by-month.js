'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');

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
      object.sumDebit = round(object.sumDebit);
      object.sumCredit = round(object.sumCredit);
      object.balance = round(object.balance);

      this._set(this.entity.newObject(object));
    }
  }

  close() {
    this.collection.off('change', this._changeCallback);
    this._reset();
  }
};

function createSkeletons(col) {
  const months = [];
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();

  // last year
  for(let month = 1; month <= 12; ++month) {
    months.push(`${nowYear-1}/${formatTwoDigits(month)}`);
  }
  // current year
  for(let month = 1; month <= nowMonth + 1; ++month) {
    months.push(`${nowYear}/${formatTwoDigits(month)}`);
  }

  return months.map(month => ({
    _id: col.newId(),
    month,
    count: 0,
    sumDebit: 0,
    sumCredit: 0,
    balance: 0
  }));
}

function dateToMonth(date) {
  const year = date.getFullYear();
  const month = formatTwoDigits(date.getMonth() + 1);
  return `${year}/${month}`;
}

function formatTwoDigits(number) {
  return number.toLocaleString(undefined, { minimumIntegerDigits: 2 });
}

function round(number) {
  if(!isFinite(number)) {
    return number;
  }
  return Math.round(number * 100) / 100;
}

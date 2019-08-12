'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { dateToMonth, formatTwoDigits, roundCurrency } = require('./tools');

exports.GroupByMonth = class GroupByMonth extends StoreContainer {
  constructor(criteria) {
    super();
    this.groups = getStoreCollection('groups');
    this._groupChangeCallback = event => this._onGroupChange(event);
    this.groups.on('change', this._groupChangeCallback);

    this.operations = getStoreCollection('operations');
    this._operationChangeCallback = event => this._operationChangeCallback(event);
    this.operations.on('change', this._operationChangeCallback);

    this._criteria = criteria;
    this.entity = getMetadataEntity('report-group-by-month');

    this._compute();
  }

  refresh() {
    this._compute();
  }

  _onGroupChange() {
    this._compute();
  }

  _onOperationChange() {
    this._compute();
  }

  _compute() {
    const { minDate, maxDate } = computeDateRange(this._criteria, this.operations);
    const { account, groups, invert, children } = this._criteria;

    const items = new Map();

    // TODO

    const objects = Array.from(items.values()).map(object => this.entity.newObject(object));
    this._replaceAll(objects);
  }

  close() {
    this.operations.off('change', this._operationChangeCallback);
    this.groups.off('change', this._groupChangeCallback);
    this._reset();
  }
};

function computeDateRange(criteria, operations) {
  let { minDate, maxDate } = criteria;
  if((!minDate || !maxDate) && operations.size) {
    let computedMinDate = Infinity;
    let computedMaxDate = -Infinity;
    for(const operation of operations.list()) {
      computedMinDate = Math.min(computedMinDate, operation.date);
      computedMaxDate = Math.max(computedMaxDate, operation.date);
    }
    minDate = minDate || new Date(computedMinDate);
    maxDate = maxDate || new Date(computedMaxDate);
  }
  return { minDate, maxDate };
}

function createSkeletons() {
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

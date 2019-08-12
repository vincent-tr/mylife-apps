'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { dateToMonth, formatTwoDigits, roundCurrency } = require('./tools');

exports.GroupByMonth = class GroupByMonth extends StoreContainer {
  constructor(criteria) {
    super();
    this.collection = getStoreCollection('operations');

    this._changeCallback = event => this._onCollectionChange(event);
    this.collection.on('change', this._changeCallback);

    this._criteria = criteria;
    this.entity = getMetadataEntity('report-group-by-month');

    this._onCollectionChange();
  }

  refresh() {
    this._onCollectionChange();
  }

  _onCollectionChange() {
    const { minDate, maxDate, account, groups, invert, children } = this._criteria;
  }

  close() {
    this.collection.off('change', this._changeCallback);
    this._reset();
  }
};

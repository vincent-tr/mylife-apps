'use strict';

const { StoreView, getStoreCollection } = require('mylife-tools-server');
const { createGroupHierarchy } = require('./tools');

exports.OperationView = class OperationView extends StoreView {
  constructor() {
    super(getStoreCollection('operations'));

    this._changeCallback = () => this._onGroupChange();
    this._groupCollection = getStoreCollection('groups');
    this._groupCollection.on('change', this._changeCallback);
  }

  setCriteria(criteria) {
    this._criteria = criteria;
    this._criteria.groupHierarchy = createGroupHierarchy(this._groupCollection, this._criteria.group);
    this.setFilter(operation => this._filterCallback(operation));
  }

  _filterCallback(operation) {
    if(this._criteria.minDate && operation.date < this._criteria.minDate) {
      return false;
    }
    if(this._criteria.maxDate && operation.date > this._criteria.maxDate) {
      return false;
    }
    if(this._criteria.account && operation.account !== this._criteria.account) {
      return false;
    }
    if(this._criteria.groupHierarchy && !this._criteria.groupHierarchy.has(operation.group)) {
      return false;
    }
    return true;
  }

  _onGroupChange() {
    this._criteria.groupHierarchy = createGroupHierarchy(this._groupCollection, this._criteria.group);
    this.refresh();
  }

  close() {
    this._groupCollection.off('change', this._changeCallback);
    super.close();
  }
};

'use strict';

const { StoreView, getStoreCollection } = require('mylife-tools-server');
const { createGroupHierarchy } = require('./tools');

exports.OperationView = class OperationView extends StoreView {
  constructor(criteria) {
    super(getStoreCollection('operations'), createFilter(criteria));
    this._criteria = criteria;

    this._changeCallback = () => this._onGroupChange();
    this._groupCollection = getStoreCollection('groups');
    this._groupCollection.on('change', this._changeCallback);

    this._onGroupChange();
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

function createFilter(criteria) {
  return operation => {
    if(criteria.minDate && operation.date < criteria.minDate) {
      return false;
    }
    if(criteria.maxDate && operation.date > criteria.maxDate) {
      return false;
    }
    if(criteria.account && operation.account !== criteria.account) {
      return false;
    }
    if(criteria.groupHierarchy && !criteria.groupHierarchy.has(operation.group)) {
      return false;
    }
    return true;
  };
}

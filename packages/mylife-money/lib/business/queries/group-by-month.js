'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { dateToMonth, roundCurrency, monthRange } = require('./tools');
const { createGroupHierarchy } = require('./tools');

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

    if(!groups.length) {
      this._replaceAll([]);
      return;
    }

    // TODO: children

    const hierarchies = groups.map(group => ({
      group: group || 'null',
      hierarchy: createGroupHierarchy(this.groups, group)
    }));

    const items = new Map();

    for(const month of monthRange(minDate, maxDate)) {
      const item = {
        _id: month,
        month,
        groups: {}
      };

      items.set(month, item);
      for(const group of groups) {
        item.groups[group || 'null'] = 0;
      }
    }

    for(const operation of this.operations.list()) {
      if(account && operation.account !== account) {
        continue;
      }
      if(operation.date < minDate || operation.date > maxDate) {
        continue;
      }

      let amount = operation.amount;
      if(invert) {
        amount = -amount;
      }

      // find groups to put it
      const item = items.get(dateToMonth(operation.date));
      for(const { group, hierarchy } of hierarchies) {
        if(hierarchy.has(operation.group)) {
          item.groups[group] += amount;
        }
      }
    }

    const data = Array.from(items.values());
    for(const item of data) {
      for(const { group } of hierarchies) {
        item.groups[group] = roundCurrency(item.groups[group]);
      }
    }
    
    const objects = data.map(item => this.entity.newObject(item));
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

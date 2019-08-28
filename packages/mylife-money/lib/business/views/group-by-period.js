'use strict';

const { StoreContainer, getStoreCollection, getMetadataEntity } = require('mylife-tools-server');
const { roundCurrency, createGroupHierarchy } = require('./tools');

exports.GroupByPeriod = class GroupByPeriod extends StoreContainer {
  constructor(entityName) {
    super();
    this.groups = getStoreCollection('groups');
    this._groupChangeCallback = event => this._onGroupChange(event);
    this.groups.on('change', this._groupChangeCallback);

    this.operations = getStoreCollection('operations');
    this._operationChangeCallback = event => this._operationChangeCallback(event);
    this.operations.on('change', this._operationChangeCallback);

    this.entity = getMetadataEntity(entityName);
  }

  setCriteria(criteria) {
    this._criteria = criteria;
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
    const { account, groups } = this._criteria;

    if(!groups.length) {
      this._replaceAll([]);
      return;
    }

    const { minDate, maxDate } = computeDateRange(this._criteria, this.operations);
    const groupInfo = createGroupInfo(this._criteria, this.groups);
    const items = this._createSkeleton(groupInfo, minDate, maxDate);

    for(const operation of this.operations.list()) {
      if(account && operation.account !== account) {
        continue;
      }
      if(operation.date < minDate || operation.date > maxDate) {
        continue;
      }

      // find groups to put it
      const monthItem = items.get(this.dateToPeriod(operation.date));
      for(const { group, hierarchy, children: childrenInfo } of groupInfo) {
        if(!hierarchy.has(operation.group)) {
          continue;
        }

        const item = monthItem.groups[group];
        let inChildren = false;

        for(const { hierarchy, group: child } of childrenInfo) {
          if(!hierarchy.has(operation.group)) {
            continue;
          }

          item.children[child].amount += operation.amount;
          inChildren = true;
          break;
        }

        if(!inChildren) {
          item.amount += operation.amount;
        }
      }
    }

    const data = Array.from(items.values());
    for(const monthItem of data) {
      for(const { group, children: childrenInfo } of groupInfo) {
        const item = monthItem.groups[group];
        item.amount = roundCurrency(item.amount);
        for(const { group: childGroup } of childrenInfo) {
          const child = item.children[childGroup];
          child.amount = roundCurrency(child.amount);
        }
      }
    }

    const objects = data.map(item => this.entity.newObject(item));
    this._replaceAll(objects);
  }

  _createSkeleton(groupInfo, minDate, maxDate) {
    const items = new Map();
    for(const period of this.periodRange(minDate, maxDate)) {
      const periodItem = this.itemFactory(period);

      items.set(period, periodItem);

      periodItem.groups = {};
      for(const { group, children } of groupInfo) {
        const item = periodItem.groups[group || 'null'] = {
          amount: 0,
          children: {}
        };
        for(const { group } of children) {
          item.children[group] = { amount: 0 };
        }
      }
    }

    return items;
  }

  periodRange(minDate, maxDate) {
    void minDate, maxDate;
    throw new Error('Not implemented');
  }

  itemFactory(period) {
    void period;
    throw new Error('Not implemented');
  }

  dateToPeriod(date) {
    void date;
    throw new Error('Not implemented');
  }

  close() {
    this.operations.off('change', this._operationChangeCallback);
    this.groups.off('change', this._groupChangeCallback);
    this._reset();
  }
};

function computeDateRange(criteria, operationCollection) {
  let { minDate, maxDate } = criteria;
  if((!minDate || !maxDate) && operationCollection.size) {
    let computedMinDate = Infinity;
    let computedMaxDate = -Infinity;
    for(const operation of operationCollection.list()) {
      computedMinDate = Math.min(computedMinDate, operation.date);
      computedMaxDate = Math.max(computedMaxDate, operation.date);
    }
    minDate = minDate || new Date(computedMinDate);
    maxDate = maxDate || new Date(computedMaxDate);
  }
  return { minDate, maxDate };
}

function createGroupInfo(criteria, groupCollection) {
  const { groups, children } = criteria;

  return groups.map(group => ({
    group: group || 'null',
    hierarchy: createGroupHierarchy(groupCollection, group),
    children: children ? getGroupChildren(groupCollection, group) : []
  }));
}

function getGroupChildren(groupCollection, groupId) {
  const results = [];
  for(const group of groupCollection.list()) {
    if(group.parent === groupId) {
      results.push({
        group: group._id,
        hierarchy: createGroupHierarchy(groupCollection, group._id)
      });
    }
  }
  return results;
}

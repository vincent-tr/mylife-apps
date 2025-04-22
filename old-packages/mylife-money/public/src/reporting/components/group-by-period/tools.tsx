'use strict';

export function findAmount(periodItem, serie) {
  const item = periodItem.groups[serie.stackId];
  if(!item) {
    return 0;
  }

  if(serie.root) {
    return item.amount;
  }

  const childItem = item.children[serie.group];
  if(!childItem) {
    return  0;
  }
  return childItem.amount;
}

export function formatCriteria(criteria) {
  const { groups, fullnames, ...props } = criteria;
  void fullnames;
  return {
    groups: groups.toArray(),
    ...props
  };
}

export function roundCurrency(number) {
  if(!isFinite(number)) {
    return number;
  }
  return Math.round(number * 100) / 100;
}

'use strict';

const { xlsx, getStoreCollection } = require('mylife-tools-server');
const { GroupByMonth } = require('./views/group-by-month');
const { GroupByYear } = require('./views/group-by-year');
const { roundCurrency } = require('./views/tools');

exports.exportGroupByMonth = (session, criteria, display) => {
  const view = new GroupByMonth();
  view.setCriteria({ ...criteria, noChildSub: true });
  return exportGroupByPeriodView(view, display, 'month');
};

exports.exportGroupByYear = (session, criteria, display) => {
  const view = new GroupByYear();
  view.setCriteria({ ...criteria, noChildSub: true });
  const amountTransform = display.monthAverage ? (x => roundCurrency(x / 12)) : (x => x);
  return exportGroupByPeriodView(view, display, 'year', amountTransform);
};

function exportGroupByPeriodView(view, displayOptions, periodKey, amountTransform = x => x) {
  const periodItems = view.list();
  if(!periodItems.length) {
    return xlsx.createSimpleWorkbookAOA([[]]);
  }

  const groups = [];
  for(const [root, item] of Object.entries(periodItems[0].groups)) {
    const display = groupDisplay(root, false, displayOptions);
    groups.push({ root, display });

    for(const child of Object.keys(item.children)) {
      const display = groupDisplay(child, true, displayOptions);
      groups.push({ root, child, display });
    }
  }

  const header = ['', ...periodItems.map(periodItem => periodItem[periodKey])];
  const data = [header];
  for(const group of groups) {
    const row = [group.display];
    data.push(row);

    for(const periodItem of periodItems) {
      let item = periodItem.groups[group.root];
      if(group.child) {
        item = item.children[group.child];
      }
      let value = item.amount;
      if(displayOptions.invert) {
        value = - value;
      }
      value = amountTransform(value);
      row.push(value);
    }
  }

  return xlsx.createSimpleWorkbookAOA(data);
}

function groupDisplay(id, withParent, { fullnames }) {
  if(!id) {
    return 'Non triés';
  }

  const groupCollection = getStoreCollection('groups');

  if(fullnames) {
    let currentId = id;
    const names = [];
    while(currentId) {
      const group = groupCollection.get(currentId);
      names.push(group.display);
      currentId = group.parent;
    }

    names.reverse();
    return names.join('/');
  }

  const group = groupCollection.get(id);
  if(!withParent) {
    return group.display;
  }

  const parent = groupCollection.get(group.parent);
  return parent.display + '/' + group.display;
}

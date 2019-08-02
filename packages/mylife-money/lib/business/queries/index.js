'use strict';

const { getStoreCollection, notifyView } = require('mylife-tools-server');
const { OperationView } = require('./operation-view');
const { OperationStats } = require('./operation-stats');
const { TotalByMonth } = require('./total-by-month');

exports.notifyOperations = (session, criteria) => {
  const view = new OperationView(criteria);
  return notifyView(session, view);
};

exports.getOperations = (minDate, maxDate, account) => {
  const operations = getStoreCollection('operations');
  return operations.filter(operation => {
    if(minDate && operation.minDate < minDate) {
      return false;
    }
    if(maxDate && operation.maxDate > maxDate) {
      return false;
    }
    if(account && operation.account !== account) {
      return false;
    }
    return true;
  });
};

exports.notifyOperationStats = session => {
  const view = new OperationStats();
  return notifyView(session, view);
};

exports.notifyTotalByMonth = session => {
  const view = new TotalByMonth();
  return notifyView(session, view);
};

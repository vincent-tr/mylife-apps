'use strict';

const { notifyView, getNotifiedView } = require('mylife-tools-server');
const { OperationView } = require('./operation-view');
const { OperationStats } = require('./operation-stats');
const { TotalByMonth } = require('./total-by-month');
const { GroupByMonth } = require('./group-by-month');

exports.notifyOperations = (session, criteria) => {
  const view = new OperationView();
  view.setCriteria(criteria);
  return notifyView(session, view);
};

exports.renotifyOperations = (session, viewId, criteria) => {
  const view = getNotifiedView(session, viewId);
  view.setCriteria(criteria);
};

exports.notifyOperationStats = session => {
  const view = new OperationStats();
  return notifyView(session, view);
};

exports.notifyTotalByMonth = session => {
  const view = new TotalByMonth();
  return notifyView(session, view);
};

exports.notifyGroupByMonth = (session, criteria) => {
  const view = new GroupByMonth(criteria);
  return notifyView(session, view);
};

'use strict';

const { notifyView, getNotifiedView } = require('mylife-tools-server');
const { OperationView } = require('./views/operation-view');
const { OperationStats } = require('./views/operation-stats');
const { TotalByMonth } = require('./views/total-by-month');
const { GroupByMonth } = require('./views/group-by-month');
const { GroupByYear } = require('./views/group-by-year');

export function renotifyWithCriteria(session, viewId, criteria) {
  const view = getNotifiedView(session, viewId);
  view.setCriteria(criteria);
}

export function notifyOperations(session, criteria) {
  const view = new OperationView();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

export function notifyOperationStats(session) {
  const view = new OperationStats();
  return notifyView(session, view);
}

export function notifyTotalByMonth(session) {
  const view = new TotalByMonth();
  return notifyView(session, view);
}

export function notifyGroupByMonth(session, criteria) {
  const view = new GroupByMonth();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

export function notifyGroupByYear(session, criteria) {
  const view = new GroupByYear();
  view.setCriteria(criteria);
  return notifyView(session, view);
}

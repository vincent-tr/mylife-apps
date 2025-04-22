'use strict';

const business = require('../business');
const { base } = require('./decorators');

export const meta = {
  name : 'reporting'
};

export const notifyOperationStats = [ base, (session/*, message*/) => {
  return business.notifyOperationStats(session);
} ];

export const notifyTotalByMonth = [ base, (session/*, message*/) => {
  return business.notifyTotalByMonth(session);
} ];

export const notifyGroupByMonth = [ base, (session, message) => {
  const { minDate, maxDate, account, groups, invert, children } = message;
  const criteria = { minDate, maxDate, account, groups, invert, children };
  return business.notifyGroupByMonth(session, criteria);
} ];

export const notifyGroupByYear = [ base, (session, message) => {
  const { minDate, maxDate, account, groups, invert, children } = message;
  const criteria = { minDate, maxDate, account, groups, invert, children };
  return business.notifyGroupByYear(session, criteria);
} ];

export const exportGroupByMonth = [ base, (session, message) => {
  const { criteria, display } = message;
  return business.exportGroupByMonth(session, criteria, display);
} ];

export const exportGroupByYear = [ base, (session, message) => {
  const { criteria, display } = message;
  return business.exportGroupByYear(session, criteria, display);
} ];

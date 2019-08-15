'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'reporting'
};

exports.notifyOperationStats = [ base, (session/*, message*/) => {
  return business.notifyOperationStats(session);
} ];

exports.notifyTotalByMonth = [ base, (session/*, message*/) => {
  return business.notifyTotalByMonth(session);
} ];

exports.notifyGroupByMonth = [ base, (session, message) => {
  const { minDate, maxDate, account, groups, invert, children } = message;
  const criteria = { minDate, maxDate, account, groups, invert, children };
  return business.notifyGroupByMonth(session, criteria);
} ];

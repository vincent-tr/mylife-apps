'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'stat'
};

exports.deleteByStrategy = [ base, (session, message) => {
  const { strategyId } = message;
  return business.statsDeleteByStrategy(strategyId);
} ];

exports.notify = [ base, (session) => {
  return business.statsNotify(session);
} ];

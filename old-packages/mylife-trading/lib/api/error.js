'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'error'
};

exports.deleteByStrategy = [ base, (session, message) => {
  const { strategyId } = message;
  return business.errorsDeleteByStrategy(strategyId);
} ];

exports.notify = [ base, (session) => {
  return business.errorsNotify(session);
} ];

'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'reporting'
};

exports.getOperations = [ base, (session, message) => {
  const { minDate, maxDate, account } = message;
  return business.getOperations(minDate, maxDate, account);
} ];

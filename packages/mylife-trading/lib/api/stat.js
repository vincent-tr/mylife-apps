'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'stat'
};

exports.notify = [ base, (session) => {
  return business.statsNotify(session);
} ];

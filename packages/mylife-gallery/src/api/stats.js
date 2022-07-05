'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'stats'
};

exports.notifyStats = [ base, (session/*, message*/) => {
  return business.statsNotify(session);
} ];

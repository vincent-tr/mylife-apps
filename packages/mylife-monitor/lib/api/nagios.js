'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'nagios'
};

exports.notifyNagios = [ base, (session/*, message*/) => {
  return business.notifyNagios(session);
} ];

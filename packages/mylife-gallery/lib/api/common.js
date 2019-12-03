'use strict';

const { api } = require('mylife-tools-server');
const { base } = require('./decorators');
const business = require('../business');

exports.meta = {
  name : 'common'
};

exports.unnotify = [ base, api.services.createUnnotify() ];

exports.renotifyWithCriteria = [ base, (session, message) => {
  const { viewId, ...criteria } = message;
  return business.renotifyWithCriteria(session, viewId, criteria);
} ];

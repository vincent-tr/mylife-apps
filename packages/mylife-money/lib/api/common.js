'use strict';

const { api } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'common'
};

exports.unnotify = [ base, api.services.createUnnotify() ];

exports.notifyAccounts = [ base, (session/*, message*/) => {
  return business.notifyAccounts(session);
} ];

exports.notifyGroups = [ base, (session/*, message*/) => {
  return business.notifyGroups(session);
} ];

exports.renotifyWithCriteria = [ base, (session, message) => {
  const { viewId, ...criteria } = message;
  return business.renotifyWithCriteria(session, viewId, criteria);
} ];

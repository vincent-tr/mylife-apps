'use strict';

const { api } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

export const meta = {
  name : 'common'
};

export const unnotify = [ base, api.services.createUnnotify() ];

export const notifyAccounts = [ base, (session/*, message*/) => {
  return business.notifyAccounts(session);
} ];

export const notifyGroups = [ base, (session/*, message*/) => {
  return business.notifyGroups(session);
} ];

export const renotifyWithCriteria = [ base, (session, message) => {
  const { viewId, ...criteria } = message;
  return business.renotifyWithCriteria(session, viewId, criteria);
} ];

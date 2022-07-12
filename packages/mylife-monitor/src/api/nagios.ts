'use strict';

const business = require('../business');
const { base } = require('./decorators');

export const meta = {
  name : 'nagios'
};

export const notify = [ base, (session/*, message*/) => {
  return business.notifyNagios(session);
} ];


export const notifySummary = [ base, (session/*, message*/) => {
  return business.notifyNagiosSummary(session);
} ];

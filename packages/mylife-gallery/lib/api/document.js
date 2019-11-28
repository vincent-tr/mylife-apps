'use strict';

const { api } = require('mylife-tools-server');
const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'document'
};

exports.unnotify = [ base, api.services.createUnnotify() ];

exports.notifyDocument = [ base, (session, message) => {
  const { type, id } = message;
  return business.notifyAccounts(session, type, id);
} ];

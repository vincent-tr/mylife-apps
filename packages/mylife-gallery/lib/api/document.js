'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'document'
};

exports.notifyDocument = [ base, (session, message) => {
  const { type, id } = message;
  return business.documentNotify(session, type, id);
} ];

exports.notifyDocuments = [ base, (session, message) => {
  const { criteria } = message;
  return business.documentNotify(session, criteria);
} ];

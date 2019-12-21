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
  return business.documentsNotify(session, criteria);
} ];

exports.updateDocument = [ base, (session, message) => {
  const { type, id, values } = message;
  return business.documentUpdate(type, id, values);
} ];

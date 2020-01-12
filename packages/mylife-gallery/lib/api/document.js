'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'document'
};

exports.notifyDocumentWithInfo = [ base, (session, message) => {
  const { type, id } = message;
  return business.documentWithInfoNotify(session, type, id);
} ];

exports.notifyDocumentsWithInfo = [ base, (session, message) => {
  const { criteria } = message;
  return business.documentsWithInfoNotify(session, criteria);
} ];

exports.updateDocument = [ base, (session, message) => {
  const { type, id, values } = message;
  const document = business.documentGet(type, id);
  return business.documentUpdate(document, values);
} ];

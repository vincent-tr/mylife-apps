'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'document'
};

exports.notifyDocuments = [ base, (session, message) => {
  const { criteria } = message;
  return business.documentsNotify(session, criteria);
} ];

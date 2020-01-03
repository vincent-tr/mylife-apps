'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'keyword'
};

exports.notifyKeywords = [ base, (session) => {
  return business.keywordsNotify(session);
} ];

'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'keyword'
};

exports.listKeywords = [ base, () => {
  return business.keywordList();
} ];

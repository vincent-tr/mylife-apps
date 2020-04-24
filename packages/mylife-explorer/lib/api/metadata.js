'use strict';

const business = require('../business');
const { base } = require('./decorators');

exports.meta = {
  name : 'metadata'
};

exports.get = [ base, (session, message) => {
  const { path } = message;
  return business.metadata(path);
} ];

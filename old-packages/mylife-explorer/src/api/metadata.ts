'use strict';

const business = require('../business');
const { base } = require('./decorators');

export const meta = {
  name : 'metadata'
};

export const get = [ base, (session, message) => {
  const { path } = message;
  return business.metadata(path);
} ];

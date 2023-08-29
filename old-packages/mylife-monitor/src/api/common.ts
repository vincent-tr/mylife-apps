'use strict';

const { api } = require('mylife-tools-server');
const { base } = require('./decorators');

export const meta = {
  name : 'common'
};

export const unnotify = [ base, api.services.createUnnotify() ];

'use strict';

const { api } = require('mylife-tools-server');
const { base } = require('./decorators');

exports.meta = {
  name : 'common'
};

exports.unnotify = [ base, api.services.createUnnotify() ];

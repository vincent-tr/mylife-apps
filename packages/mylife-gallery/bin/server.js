#!/usr/bin/env node

'use strict';

require('../lib/init');
require('../lib/index-service');
const { runServices, getArg } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');
const { apiServices } = require('../lib/api');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../lib/store-configuration');
require('../lib/sync');

const runWeb = !!getArg('web');
const runSync = !!getArg('sync');

const services = ['store', 'database', 'index-service'];
const parameters = { webApiFactory, apiServices, metadataDefintions, storeConfiguration };

if(runWeb) {
  services.push('web-server', 'notification-service');
}

if(runSync) {
  services.push('sync-server');
}

runServices({ services, ... parameters });

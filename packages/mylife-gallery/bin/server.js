#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices, getArg } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../lib/store-configuration');
require('../lib/sync');

const runWeb = !!getArg('web');
const runSync = !!getArg('sync');

const services = ['store', 'database'];
const parameters = { webApiFactory, metadataDefintions, storeConfiguration };

if(runWeb) {
  services.push('web-server');
}

if(runSync) {
  services.push('sync-server');
}

runServices({ services, ... parameters });

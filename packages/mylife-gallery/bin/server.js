#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../lib/store-configuration');
require('../lib/sync');

const services = ['web-server', 'sync-server', 'store', 'database'];
const parameters = { webApiFactory, metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

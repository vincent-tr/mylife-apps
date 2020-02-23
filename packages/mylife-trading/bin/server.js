#!/usr/bin/env node

'use strict';

require('../lib/init');
require('../ts-lib/trading-service');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../lib/api');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../lib/store-configuration');

const services = ['trading-service', 'web-server', 'store', 'notification-service'];
const parameters = { apiServices, metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

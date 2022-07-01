#!/usr/bin/env node

'use strict';

require('../src/init');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../src/api');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../src/store-configuration');

const services = ['web-server', 'store', 'notification-service'];
const parameters = { apiServices, metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

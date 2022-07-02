#!/usr/bin/env node

'use strict';

require('../src/init');
require('../src/portal-web-server');
const { runServices } = require('mylife-tools-server');
const metadataDefintions = require('../src/metadata');
const storeConfiguration = require('../src/store-configuration');

const services = ['portal-web-server'];
const parameters = { metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

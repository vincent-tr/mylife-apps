#!/usr/bin/env node

'use strict';

require('../lib/init');
require('../lib/portal-web-server');
const { runServices } = require('mylife-tools-server');
const metadataDefintions = require('../lib/metadata');
const storeConfiguration = require('../lib/store-configuration');

const services = ['portal-web-server'];
const parameters = { metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const metadataDefintions = require('../lib/metadata');
const storeConfiguration = require('../lib/store-configuration');

const services = ['store'];
const parameters = { apiServices, metadataDefintions, storeConfiguration };
runServices({ services, ... parameters });

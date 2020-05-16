#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../lib/api');
const metadataDefintions = require('../shared/metadata');

const services = ['web-server', 'notification-service'];
const parameters = { apiServices, metadataDefintions };
runServices({ services, ... parameters });

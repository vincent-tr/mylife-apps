#!/usr/bin/env node

'use strict';

require('../lib/init');
require('../lib/nagios-service');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../lib/api');
const metadataDefintions = require('../shared/metadata');

const services = ['nagios-service', 'web-server', 'notification-service'];
const parameters = { apiServices, metadataDefintions };
runServices({ services, ... parameters });

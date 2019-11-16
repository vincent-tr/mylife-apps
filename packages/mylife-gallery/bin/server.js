#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');
require('../lib/sync');

const services = ['web-server', 'sync-server', 'database'];
const parameters = { webApiFactory };
runServices({ services, ... parameters });

#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');

const services = ['web-server', 'database'];
const parameters = { webApiFactory };
runServices({ services, ... parameters });

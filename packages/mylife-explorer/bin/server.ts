#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web');
const { apiServices } = require('../lib/api');

const services = ['web-server'];
const parameters = { webApiFactory, apiServices };

runServices({ services, ... parameters });

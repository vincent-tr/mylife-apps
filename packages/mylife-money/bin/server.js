#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web-api');
const { apiServices } = require('../lib/api');

runServices({ services: ['web-server', 'database'], webApiFactory, apiServices });

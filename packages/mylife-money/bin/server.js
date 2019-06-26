#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices } = require('mylife-tools-server');
const { apiServices } = require('../lib/api');

runServices({ services: ['web-server', 'database'], apiServices });

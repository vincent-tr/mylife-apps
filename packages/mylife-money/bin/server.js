#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices, WebServer, IO, TaskQueue, ApiRegistry, Database } = require('mylife-tools-server');
const { webApiFactory } = require('../lib/web-api');
const { apiServices } = require('../lib/api');

runServices({ services: [WebServer, IO, TaskQueue, ApiRegistry, Database], webApiFactory, apiServices });

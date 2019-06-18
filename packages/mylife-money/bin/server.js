#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices, WebServer, IO, TaskQueue, ApiRegistry, Database } = require('mylife-tools-server');
const { createApi } = require('../lib/web-api');
const { apiServices } = require('../lib/api');

runServices({ services: [WebServer, IO, TaskQueue, ApiRegistry, Database], apiCreator: createApi, apiServices });

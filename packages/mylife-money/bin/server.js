#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runServices, WebServer, Database } = require('mylife-tools-server');
const { createApi } = require('../lib/web-api');

runServices({ services: [Database, WebServer], apiCreator: createApi });

#!/usr/bin/env node

'use strict';

require('../lib/init');
const { runWebServer } = require('mylife-tools-server');
const createApi = require('../lib/api');

runWebServer({ apiCreator : app => { app.use('/api', createApi()); } });

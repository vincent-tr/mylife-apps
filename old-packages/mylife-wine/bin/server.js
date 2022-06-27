#!/usr/bin/env node

'use strict';

const readConfig = require('read-config');
const config = readConfig(require.resolve('../conf/config'));
const Server = require('../lib/server');

const dev = process.argv.includes('--dev');

const server = new Server(config, dev);

function terminate() {
  server.close(() => process.exit());
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

'use strict';

const path = require('path');
const { init } = require('mylife-tools-server');

init({
  baseDirectory: path.resolve(__dirname, '..'),
  applicationName: 'mylife-money'
});

const Server = require('../lib/server');
const server = new Server();

function terminate() {
  server.close(() => process.exit());
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

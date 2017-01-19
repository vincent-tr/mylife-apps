'use strict';

const config = require('../conf/config');
const Server = require('../lib/server');

const server = new Server(config);

function terminate() {
  server.close(() => process.exit());
}

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);

#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger } = require('mylife-tools-server');

const logger = createLogger('mylife:gallery:bin:server');
const Server = require('../lib/server');

const dev = process.argv.includes('--dev');
const options = { dev };

let server;

async function start() {

  logger.info(`Starting server (options=${JSON.stringify(options)})`);

  try {
    server = new Server();
    await server.init(options);
  } catch(err) {
    console.error('Error starting server', err); // eslint-disable-line no-console
    process.exit();
  }
}

async function stop() {
  try {
    await server.close();
    server = null;
  } catch(err) {
    console.error('Error closing server', err); // eslint-disable-line no-console
  }

  process.exit();
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

start();

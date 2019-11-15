#!/usr/bin/env node

'use strict';

const debug = require('debug')('mylife:gallery:bin:server');
require('../lib/init');
const Server = require('../lib/server');

const dev = process.argv.includes('--dev');
const options = { dev };

let server;

async function start() {

  debug(`Starting server (options=${JSON.stringify(options)})`);

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
'use strict';

const debug = require('debug')('mylife:explorer:bin:server');
const configFile = require('../conf/config');
const Server = require('../lib/server');

const dev = process.argv.includes('--dev');
const config = Object.assign({}, configFile, { dev });

let server;

async function start() {

  debug(`Starting server (config=${JSON.stringify(config)})`);

  try {
    server = new Server();
    await server.init(config);
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
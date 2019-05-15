#!/usr/bin/env node

'use strict';

const fs = require('fs');
require('../lib/init');
const { createLogger, initDatabase } = require('mylife-tools-server');
const { operationsImport } = require('../lib/cli.js');

const logger = createLogger('mylife:money:import');

main();

async function main() {
  try {
    await initDatabase();

    // TODO: rewrite with yargs
    const account = process.argv[2];
    const file    = process.argv[3];
    const data    = fs.readFileSync(file);

    await operationsImport(account, data);
    logger.info('Import successfully executed');

  } catch(err) {
    logger.error(err.stack);
  }
}

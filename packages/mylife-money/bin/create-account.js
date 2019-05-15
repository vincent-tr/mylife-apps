#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger, initDatabase, closeDatabase } = require('mylife-tools-server');
const { createAccount } = require('../lib/cli.js');

const logger = createLogger('mylife:money:create-account');

main();

async function main() {
  try {
    // TODO: rewrite with yargs
    const code    = process.argv[2];
    const display = process.argv[3];

    if(!code || !display) {
      console.log('Usage: bin/create-account.js <code> <display>');
      return;
    }

    await createAccount(code, display);
    logger.info('Account successfully created');
    await closeDatabase();

  } catch(err) {
    logger.error(err.stack);
    process.exit(1);
  }
}

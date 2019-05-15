#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger, initDatabase } = require('mylife-tools-server');
const { createAccount } = require('../lib/cli.js');

const logger = createLogger('mylife:money:create-account');

main();

async function main() {
  try {
    await initDatabase();

    // TODO: rewrite with yargs
    const code    = process.argv[2];
    const display = process.argv[3];

    if(!code || !display) {
      console.log('Usage: bin/create-account <code> <display>');
      return;
    }

    await createAccount(db, code, display);
    logger.info('Account successfully created');

  } catch(err) {
    logger.error(err.stack);
  }
}

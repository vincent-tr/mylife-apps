#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger, runTask } = require('mylife-tools-server');
const business = require('../lib/business');

const logger = createLogger('mylife:money:create-account');

runTask({ services: ['database'], task: async () => {
  // TODO: rewrite with yargs
  const code    = process.argv[2];
  const display = process.argv[3];

  if(!code || !display) {
    console.log('Usage: bin/create-account.js <code> <display>');
    return;
  }

  await business.createAccount(code, display);
  logger.info('Account successfully created');
} });

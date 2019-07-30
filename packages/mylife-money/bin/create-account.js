#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger, runTask } = require('mylife-tools-server');
const business = require('../lib/business');
const metadataDefintions = require('../shared/metadata');
const storeConfiguration = require('../lib/store-configuration');

const logger = createLogger('mylife:money:create-account');

runTask({ services: ['store'], metadataDefintions, storeConfiguration, task: async () => {
  // TODO: rewrite with yargs
  const code    = process.argv[2];
  const display = process.argv[3];

  if(!code || !display) {
    console.log('Usage: bin/create-account.js <code> <display>'); // eslint-disable-line no-console
    return;
  }

  await business.createAccount(code, display);
  logger.info('Account successfully created');
} });

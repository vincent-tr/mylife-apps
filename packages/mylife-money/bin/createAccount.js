#!/usr/bin/env node

'use strict';

const monk              = require('monk');
const config            = require('../conf/config');
const fs                = require('fs');
const log4js            = require('log4js');
const logger            = log4js.getLogger('mylife:money:createAccount');
const { createAccount } = require('../lib/cli.js');

const code    = process.argv[2];
const display = process.argv[3];

if(!code || !display) {
  console.log('Usage: node bin/createAccount <code> <display>');
  return;
}

const db = monk(config.mongo);

createAccount(db, code, display, (err) => {
  if(err) {
    db.close();
    return logger.error(err);
  }

  logger.info("Account successfully created");
  db.close();
});

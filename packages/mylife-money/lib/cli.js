'use strict';


const coMonk   = require('co-monk');
const co       = require('co');
const log4js   = require('log4js');
const logger   = log4js.getLogger('mylife:money:cli');
const { operationsImport, executeRules } = require('./importer');

exports.createAccount = async (code, display) => {
  const accounts = getDatabaseCollection('accounts');

  if(await accounts.findOne({ code }, { fields: { _id : 1 }})) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = {
    code, display
  };

  await accounts.insert(account);

  logger.info(`Account created: ${code}`);
};

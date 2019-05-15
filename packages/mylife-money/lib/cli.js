'use strict';


const coMonk   = require('co-monk');
const co       = require('co');
const log4js   = require('log4js');
const logger   = log4js.getLogger('mylife:money:cli');
const { operationsImport, executeRules } = require('./importer');

exports.operationsImport = async (accountCode, data) => {
  const accounts   = getDatabaseCollection('accounts');

  const account = await accounts.findOne({ code: accountCode }, { fields: { _id : 1 }});
  if(!account) {
    throw new Error(`Account not found: ${accountCode}`);
  }

  const ret = await operationsImport(account._id, data);
  await executeRules();
  return ret;
};

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

'use strict';

const { createLogger, initDatabase, getDatabaseCollection } = require('mylife-tools-server');
const { operationsImport, executeRules } = require('./importer');

const logger = createLogger('mylife:money:cli');

exports.createAccount = async (code, display) => {
  const accounts = getDatabaseCollection('accounts');

  if(await accounts.findOne({ code }, { fields: { _id : 1 }})) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = { code, display };

  await accounts.insert(account);

  logger.info(`Account created: ${code}`);
};

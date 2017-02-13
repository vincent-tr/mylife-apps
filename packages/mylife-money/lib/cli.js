'use strict';


const coMonk   = require('co-monk');
const co       = require('co');
const log4js   = require('log4js');
const logger   = log4js.getLogger('mylife:money:cli');
const importer = require('./importer');
const { asyncToPromise } = require('./utils');

module.exports.operationsImport = (db, accountCode, data, done) => {
  co(function*() {
    const accounts   = coMonk(db.get('accounts'));

    const account = yield accounts.findOne({ code: accountCode }, { fields: { _id : 1 }});
    if(!account) {
      throw new Error(`Account not found: ${accountCode}`);
    }

    return yield asyncToPromise(importer)(account._id, data);
  }).then(() => done(), (err) => done(err));
};

module.exports.createAccount = (db, code, display, done) => {
  co(function*() {

    const accounts = coMonk(db.get('accounts'));

    if(yield accounts.findOne({ code }, { fields: { _id : 1 }})) {
      throw new Error(`Account already exists: ${code}`);
    }

    const account = {
      code, display
    };

    yield accounts.insert(account);

    logger.info(`Account created: ${code}`);

  }).then(() => done(), (err) => done(err));
};

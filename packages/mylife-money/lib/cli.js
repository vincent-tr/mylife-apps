'use strict';


const csv    = require('csv-parse/lib/sync');
const moment = require('moment');
const coMonk = require('co-monk');
const co     = require('co');
const log4js = require('log4js');
const logger = log4js.getLogger('mylife:money:cli');

const parseDate   = (input) => moment(input, 'DD/MM/YYYY').toDate();
const parseNumber = (input) => parseFloat(input.replace(',','.'));

module.exports.operationsImport = (db, accountCode, data, done) => {
  co(function*() {
    const raw = csv(data, {
      delimiter : ';',
      columns   : ['operationDate', 'valueDate', 'debit', 'credit', 'label', 'balance']
    });

    const accounts   = coMonk(db.get('accounts'));
    const operations = coMonk(db.get('operations'));

    const account = yield accounts.findOne({ code: accountCode }, { fields: { _id : 1 }});
    if(!account) {
      throw new Error(`Account not found: ${accountCode}`);
    }

    let records = raw.map(r => ({
      date    : parseDate(r.operationDate),
      amount  : parseNumber(r.debit ? r.debit : r.credit),
      label   : r.label,
      account : account._id
    }));

    const lastOperation     = yield operations.findOne({}, { sort : { date : -1 }, fields: { date : 1 } });
    const lastOperationDate = lastOperation ? lastOperation.date : new Date(0);
    records = records.filter(rec => rec.date > lastOperationDate);

    if(records.length) {
      yield operations.insert(records);
    }

    logger.info(`Import done, ${records.length} operations added`);

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

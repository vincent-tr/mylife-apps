'use strict';


const csv    = require('csv-parse/lib/sync');
const moment = require('moment');
const coMonk = require('co-monk');
const co     = require('co');
const log4js = require('log4js');
const logger = log4js.getLogger('mylife:money:importer');

const parseDate   = (input) => moment(input, 'DD/MM/YYYY').toDate();
const parseNumber = (input) => parseFloat(input.replace(',','.'));

module.exports.operationsImport = (db, data, done) => {
  co(function*() {
    const raw = csv(data, {
      delimiter : ';',
      columns   : ['operationDate', 'valueDate', 'debit', 'credit', 'label', 'balance']
    });

    let records = raw.map(r => ({
      date   : parseDate(r.operationDate),
      amount : parseNumber(r.debit ? r.debit : r.credit),
      label  : r.label
    }));

    const operations = coMonk(db.get('operations'));

    const lastOperation     = yield operations.findOne({}, { sort : { date : -1 }, fields: { date : 1 } });
    const lastOperationDate = lastOperation ? lastOperation.date : new Date(0);
    records = records.filter(rec => rec.date > lastOperationDate);

    if(records.length) {
      yield operations.insert(records);
    }

    logger.info(`Import done, ${records.length} operations added`);

  }).then(() => done(), (err) => done(err));
};

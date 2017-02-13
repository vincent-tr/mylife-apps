'use strict';

const csv    = require('csv-parse/lib/sync');
const moment = require('moment');
const monk   = require('monk');
const config = require('../conf/config');
const coMonk = require('co-monk');
const co     = require('co');
const log4js = require('log4js');
const logger = log4js.getLogger('mylife:money:importer');

const parseDate   = (input) => moment(input, 'DD/MM/YYYY').toDate();
const parseNumber = (input) => parseFloat(input.replace(',','.'));

module.exports = (account, data, done) => {
  co(function*() {
    const db = monk(config.mongo);

    const raw = csv(data, {
      delimiter : ';',
      columns   : ['operationDate', 'valueDate', 'debit', 'credit', 'label', 'balance']
    });

    const operations = coMonk(db.get('operations'));

    let records = raw.map(r => ({
      date    : parseDate(r.operationDate),
      amount  : parseNumber(r.debit ? r.debit : r.credit),
      label   : r.label,
      account
    }));

    const lastOperation     = yield operations.findOne({}, { sort : { date : -1 }, fields: { date : 1 } });
    const lastOperationDate = lastOperation ? lastOperation.date : new Date(0);
    records = records.filter(rec => rec.date > lastOperationDate);

    if(records.length) {
      yield operations.insert(records);
    }

    logger.info(`Import done, ${records.length} operations added`);

    db.close();

    return records.length;

  }).then((res) => done(null, res), (err) => done(err));
};

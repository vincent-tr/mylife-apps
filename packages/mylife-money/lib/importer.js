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

module.exports.operationsImport = (account, data, done) => {
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

module.exports.executeRules = (done) => {
  co(function*() {

    logger.info('Executing rules');

    const db = monk(config.mongo);

    const operationCollection = coMonk(db.get('operations'));
    const groupCollection = coMonk(db.get('groups'));

    const operations = yield operationCollection.find({ group : null });
    const groups = yield groupCollection.find({});

    const ruleExecutor = buildRulesExecutor(groups);

    let opCount = 0;
    for(const operation of operations) {
      const group = ruleExecutor(operation);
      if(!group) { continue; }
      logger.info(`Moving operation ${operation._id} to group ${group._id} (${group.display})`);
      yield operationCollection.update({ _id: operation._id}, { $set: { group: group._id } });
      ++opCount;
    }

    logger.info(`Execution done, moved ${opCount} operations`);

    db.close();

    return opCount;

  }).then((res) => done(null, res), (err) => done(err));
};

function buildRulesExecutor(groups) {
  const operators = {
    $eq       : (field, value) => field === value,
    $gt       : (field, value) => field < value,
    $gte      : (field, value) => field <= value,
    $lt       : (field, value) => field > value,
    $lte      : (field, value) => field >= value,
    $regex    : (field, value) => (new RegExp(value).test(field)),
    $contains : (field, value) => (field && field.toString().includes(value))
  };

  const conditionExecutorFactory = (condition) => (operation) => operators[condition.operator](operation[condition.field], condition.value);

  const ruleExecutorFactory = (rule) => {
    const conditionExecutors = rule.conditions.map(conditionExecutorFactory);
    if(!conditionExecutors) { return () => false; }
    return (operation) => {
      for(const executor of conditionExecutors) {
        if(!executor(operation)) { return false; }
      }
      return true;
    };
  };

  const rules = [];
  for(const group of groups) {
    if(!group.rules) { continue; }
    for(const rule of group.rules) {
      rules.push({
        executor: ruleExecutorFactory(rule),
        group
      });
    }
  }

  return (operation) => {
    for(const rule of rules) {
      if(rule.executor(operation)) {
        return rule.group;
      }
    }
  };
}
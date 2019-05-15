'use strict';

const csv    = require('csv-parse/lib/sync');
const moment = require('moment');
const { createLogger, getDatabaseCollection, dbObjects } = require('mylife-tools-server');

const { ObjectID } = dbObjects;
const logger = createLogger('mylife:money:importer');

const parseDate   = (input) => moment(input, 'DD/MM/YYYY').toDate();
const parseNumber = (input) => parseFloat(input.replace(',','.'));

exports.operationsImport = async (account, data) => {

  const raw = csv(data, {
    delimiter : ';',
    columns   : ['operationDate', 'valueDate', 'debit', 'credit', 'label', 'balance'],
    from      : 2 // skip headers
  });

  const operations = getDatabaseCollection('operations');

  let records = raw.map(r => ({
    date    : parseDate(r.operationDate),
    amount  : parseNumber(r.debit ? r.debit : r.credit),
    label   : r.label,
    account
  }));

  const lastOperation = await operations.findOne({}, { sort : { date : -1 }, fields: { date : 1 } });

  if(lastOperation) {
    // "merge" the day, then use all after
    const lastOperationDate = lastOperation.date;
    const lastDayOperations = await(await operations.find({ date: lastOperationDate })).toArray();
    const opHashSet = new Set(lastDayOperations.map(op => `${op.amout}|${op.account}|${op.label}`));

    records = records.filter(rec => {
      if(rec.date < lastOperationDate) {
        return false;
      }
      if(rec.date > lastOperationDate) {
        return true;
      }

      // lookup into lastDayOperations by amount/label/account
      const recHash = `${rec.amout}|${rec.account}|${rec.label}`;
      return !opHashSet.has(recHash);
    });
  }

  if(records.length) {
    await operations.insertMany(records);
  }

  logger.info(`Import done, ${records.length} operations added`);
  return records.length;
};

exports.executeRules = async () => {
  logger.info('Executing rules');

  const operationCollection = getDatabaseCollection('operations');
  const groupCollection = getDatabaseCollection('groups');

  const operations = await(await operationCollection.find({ group : null })).toArray();
  const groups = await(await groupCollection.find({})).toArray();

  const ruleExecutor = buildRulesExecutor(groups);

  let opCount = 0;
  for(const operation of operations) {
    const group = ruleExecutor(operation);
    if(!group) { continue; }
    logger.info(`Moving operation ${operation._id} to group ${group._id} (${group.display})`);
    await operationCollection.updateOne({ _id: operation._id}, { $set: { group: group._id } });
    ++opCount;
  }

  logger.info(`Execution done, moved ${opCount} operations`);

  return opCount;
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

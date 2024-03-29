import { parse as csv } from 'csv-parse/sync';
import moment from 'moment';
import { createLogger, getStoreCollection } from 'mylife-tools-server';

const logger = createLogger('mylife:money:importer');

export function operationsImport(account, data) {

  let records = parseRecords(account, data);
  records = filterExisting(records);
  insertRecords(records);

  logger.info(`Import done, ${records.length} operations added`);
  return records.length;
}

function parseRecords(account, data) {
  const raw = csv(data, {
    delimiter : ';',
    columns   : ['operationDate', 'valueDate', 'debit', 'credit', 'label', 'balance'],
    from      : 2 // skip headers
  });

  return raw.map(r => ({
    date    : parseDate(r.operationDate),
    amount  : parseNumber(r.debit ? r.debit : r.credit),
    label   : r.label,
    account
  }));
}

function parseDate(input) {
  const momentDate = moment(input, 'DD/MM/YYYY', true);
  if(!momentDate.isValid()) {
    throw new Error(`Date '${input}' could not be parsed`);
  }
  return momentDate.toDate();
}

function parseNumber(input) {
  return parseFloat(input.replace(',','.'));
}

function findLastOperation() {
  const operations = getStoreCollection('operations');
  let lastOperation;
  for(const operation of operations.list()) {
    if(!lastOperation || operation.date > lastOperation.date) {
      lastOperation = operation;
    }
  }
  return lastOperation;
}

function filterExisting(records) {
  const operations = getStoreCollection('operations');
  const lastOperation = findLastOperation();

  if(!lastOperation) {
    return records;
  }

  // "merge" the day, then use all after
  const lastOperationDate = lastOperation.date;
  const lastDayOperations = operations.filter(operation => operation.date.valueOf() === lastOperationDate.valueOf());
  const opHashSet = new Set(lastDayOperations.map(op => `${op.amount}|${op.account}|${op.label}`));

  return records.filter(rec => {
    if(rec.date < lastOperationDate) {
      return false;
    }
    if(rec.date > lastOperationDate) {
      return true;
    }

    // lookup into lastDayOperations by amount/label/account
    const recHash = `${rec.amount}|${rec.account}|${rec.label}`;
    return !opHashSet.has(recHash);
  });
}

function insertRecords(records) {
  const operations = getStoreCollection('operations');
  for(const record of records) {
    operations.set(operations.entity.newObject(record));
  }
}

export function executeRules() {
  logger.info('Executing rules');

  const operations = getStoreCollection('operations');
  const groups = getStoreCollection('groups');

  const unsortedOperations = operations.filter(operation => !operation.group);
  const ruleExecutor = buildRulesExecutor(groups.list());

  const groupField = operations.entity.getField('group');
  let opCount = 0;
  for(const operation of unsortedOperations) {
    const group = ruleExecutor(operation);
    if(!group) { continue; }

    logger.info(`Moving operation ${operation._id} to group ${group._id} (${group.display})`);
    operations.set(groupField.setValue(operation, group._id));
    ++opCount;
  }

  logger.info(`Execution done, moved ${opCount} operations`);

  return opCount;
}

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

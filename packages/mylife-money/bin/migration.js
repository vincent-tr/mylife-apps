#!/usr/bin/env node

'use strict';

require('../lib/init');
const { createLogger, runTask, getDatabaseCollection, getService } = require('mylife-tools-server');

const logger = createLogger('mylife:money:migration');

runTask({ services: ['database'], task: async () => {

  await processCollection('groups', transformGroup);
  await processCollection('operations', transformOperation);

  logger.info('Migration successful');
} });

async function processCollection(name, recordTransformer) {
  logger.info(`Processing ${name}`);

  const collection = getDatabaseCollection(name);
  const cursor = collection.find({});

  let record;
  let count = 0;
  while((record = await cursor.next())) {
    const newRecord = recordTransformer(record);
    if(newRecord) {
      await collection.replaceOne({ _id: record._id }, newRecord);
      ++count;
    }
  }

  await cursor.close();
  logger.info(`Processed ${name}: ${count} records updated`);
}

function transformGroup(group) {
  // groups: parent: undefined or objectid

  let changed = false;

  changed |= nullToUndefined(group, 'parent');
  changed |= stringToOid(group, 'parent');

  return changed && group;
}

function transformOperation(operation) {
  // operations: account => object id account
  // operations: null values -> undefined values

  let changed = false;

  changed |= stringToOid(operation, 'account');
  changed |= nullToUndefined(operation, 'group');
  changed |= nullToUndefined(operation, 'note');

  return changed && operation;
}

function newObjectID(id) {
  return getService('database').newObjectID(id);
}

function stringToOid(record, prop) {
  if(typeof record[prop] !== 'string') {
    return false;
  }

  record[prop] = newObjectID(record[prop]);
  return true;
}

function nullToUndefined(record, prop) {
  if(record[prop] !== null) {
    return false;
  }

  delete record[prop];
  return true;
}

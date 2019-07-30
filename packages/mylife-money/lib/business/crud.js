'use strict';

const { createLogger, getDatabaseCollection, getStoreCollection, dbObjects } = require('mylife-tools-server');

const { ObjectID } = dbObjects;
const logger = createLogger('mylife:money:business');

exports.getAccounts = async () => {
  const accounts = getStoreCollection('accounts');
  return accounts.list();
};

exports.createAccount = async (code, display) => {
  const accounts = getDatabaseCollection('accounts');

  if(await accounts.findOne({ code }, { fields: { _id : 1 }})) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = { code, display };
  await accounts.insertOne(account);
};

exports.getGroups = async () => {
  const groups = getStoreCollection('groups');
  return groups.list();
};

exports.createGroup = async group => {
  group.parent = group.parent && new ObjectID(group.parent);
  const groups = getDatabaseCollection('groups');
  await groups.insertOne(group);
  return formatId(group);
};

exports.updateGroup = async group => {
  group._id = new ObjectID(group.id);
  group.parent = group.parent && new ObjectID(group.parent);
  delete group.id;
  const groups = getDatabaseCollection('groups');
  await groups.replaceOne({ _id: group._id }, group);
  return formatId(group);
};

exports.deleteGroup = async id => {
  const groups = getDatabaseCollection('groups');
  const operations = getDatabaseCollection('operations');

  const child = await groups.findOne({ parent: new ObjectID(id) });
  if(child) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

  const operation = await operations.findOne({ group: new ObjectID(id) });
  if(operation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

  return await groups.deleteOne({ _id: new ObjectID(id) });
};

exports.getOperations = async (minDate, maxDate, account) => {
  const operations = getStoreCollection('operations');
  return operations.filter(operation => {
    if(minDate && operation.minDate < minDate) {
      return false;
    }
    if(maxDate && operation.maxDate > maxDate) {
      return false;
    }
    if(account && operation.account !== account) {
      return false;
    }
    return true;
  });
};

exports.operationsMove = async (groupId, operationIds) => {
  const operations = getDatabaseCollection('operations');
  return await operations.updateMany(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { group: groupId ? new ObjectID(groupId) : null } },
    { multi: true }
  );
};

exports.operationsSetNote = async (note, operationIds) => {
  const operations = getDatabaseCollection('operations');
  return await operations.updateMany(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { note: note ? note : null } },
    { multi: true }
  );
};

function formatId(obj) {
  for(const [key, value] of Object.entries(obj)) {
    if(value instanceof ObjectID) {
      obj[key] = value.toString();
    }
  }
  return obj;
}

function formatIds(arr) {
  return arr.map(formatId);
}

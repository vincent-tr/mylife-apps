'use strict';

const { createLogger, getDatabaseCollection, dbObjects } = require('mylife-tools-server');

const { ObjectID } = dbObjects;
const logger = createLogger('mylife:money:business');

exports.getAccounts = async () => {
  const accounts = getDatabaseCollection('accounts');
  const records = await accounts.find({});
  return await records.toArray();
}

exports.createAccount = async (code, display) => {
  const accounts = getDatabaseCollection('accounts');

  if(await accounts.findOne({ code }, { fields: { _id : 1 }})) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = { code, display };

  await accounts.insertOne(account);

  logger.info(`Account created: ${code}`);
};

exports.getGroups = async () => {
  const groups = getDatabaseCollection('groups');
  const records = await groups.find({});
  return await records.toArray();s
};

exports.createGroup = async group => {
  const groups = getDatabaseCollection('groups');
  return await groups.insertOne(group);
};

exports.updateGroup = async group => {
  group._id = group.id;
  delete group.id;
  const groups = getDatabaseCollection('groups');
  await groups.updateOne({ _id: group._id }, group);
  return group;
};

exports.deleteGroup = async id => {
  const groups = getDatabaseCollection('groups');
  const operations = getDatabaseCollection('operations');

  const child = await groups.findOne({ parent: id });
  if(child) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

  const operation = await operations.findOne({ group: id });
  if(operation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

  return await groups.deleteOne({ _id: id });
};

exports.getOperations = async (minDate, maxDate, account) => {
  const operations = getDatabaseCollection('operations');
  const criteria = {};
  if(minDate) {
    criteria.date = criteria.date || {};
    criteria.date.$gte = new Date(parseInt(minDate, 10));
  }
  if(maxDate) {
    criteria.date = criteria.date || {};
    criteria.date.$lte = new Date(parseInt(maxDate, 10));
  }
  if(account) {
    criteria.account = { $eq: new ObjectID(account) };
  }

  const records = await operations.find(criteria);
  return await records.toArray();
}

exports.operationsMove = async (groupId, operationIds) => {
  const operations = getDatabaseCollection('operations');
  return await operations.updateMany(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { group: groupId ? new ObjectID(groupId) : null } },
    { multi: true }
  );
}

exports.operationsSetNote = async (note, operationIds) => {
  const operations = getDatabaseCollection('operations');
  return await operations.updateMany(
    { _id: { $in: operationIds.map(id => new ObjectID(id)) } },
    { $set: { note: note ? note : null } },
    { multi: true }
  );
}

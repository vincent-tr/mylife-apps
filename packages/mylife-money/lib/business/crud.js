'use strict';

const { getStoreCollection } = require('mylife-tools-server');

exports.getAccounts = () => {
  const accounts = getStoreCollection('accounts');
  return accounts.list();
};

exports.createAccount = (code, display) => {
  const accounts = getStoreCollection('accounts');

  if(accounts.exists(account => account.code === code)) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = accounts.entity.newObject({ code, display });
  accounts.set(account);
};

exports.getGroups = () => {
  const groups = getStoreCollection('groups');
  return groups.list();
};

exports.createGroup = group => {
  const groups = getStoreCollection('groups');
  group = groups.entity.newObject(group);
  group = groups.set(group);
  return group;
};

exports.updateGroup = group => {
  // FIXME
  group._id = group.id;
  const groups = getStoreCollection('groups');
  let existingGroup = groups.get(group._id);
  existingGroup = groups.entity.setValues(existingGroup, group);
  existingGroup = groups.set(existingGroup);
  return existingGroup;
};

exports.deleteGroup = id => {
  const groups = getStoreCollection('groups');
  const operations = getStoreCollection('operations');

  const hasChild = groups.exists(group => group.parent === id);
  if(hasChild) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

  const hasOperation = operations.exists(operation => operation.group === id);
  if(hasOperation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

  groups.delete(id);
};

exports.getOperations = (minDate, maxDate, account) => {
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

exports.operationsMove = (groupId, operationIds) => {
  return operationsSetField(operationIds, 'group', groupId);
};

exports.operationsSetNote = (note, operationIds) => {
  return operationsSetField(operationIds, 'note', note);
};

function operationsSetField(operationIds, fieldName, fieldValue) {
  const operations = getStoreCollection('operations');
  const field = operations.entity.getField(fieldName);
  const ids = new Set(operationIds);
  const list = operations.filter(operation => ids.has(operation._id));
  for(const operation of list) {
    operations.set(field.setValue(operation, fieldValue));
  }
  return list.length;
}

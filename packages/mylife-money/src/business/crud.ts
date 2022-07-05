'use strict';

const { getStoreCollection, notifyView } = require('mylife-tools-server');

export function notifyAccounts(session) {
  const accounts = getStoreCollection('accounts');
  return notifyView(session, accounts.createView());
}

export function createAccount(code, display) {
  const accounts = getStoreCollection('accounts');

  if(accounts.exists(account => account.code === code)) {
    throw new Error(`Account already exists: ${code}`);
  }

  const account = accounts.entity.newObject({ code, display });
  accounts.set(account);
}

export function notifyGroups(session) {
  const groups = getStoreCollection('groups');
  return notifyView(session, groups.createView());
}

export function createGroup(group) {
  const groups = getStoreCollection('groups');
  group = groups.entity.newObject(group);
  group = groups.set(group);
  return group;
}

export function updateGroup(group) {
  const groups = getStoreCollection('groups');
  let existingGroup = groups.get(group._id);
  existingGroup = groups.entity.setValues(existingGroup, group);
  existingGroup = groups.set(existingGroup);
  return existingGroup;
}

export function deleteGroup(id) {
  const groups = getStoreCollection('groups');
  const operations = getStoreCollection('operations');

  const hasChild = groups.exists(group => group.parent === id);
  if(hasChild) { throw new Error(`Cannot delete group '${id}' because it has children groups`); }

  const hasOperation = operations.exists(operation => operation.group === id);
  if(hasOperation) { throw new Error(`Cannot delete group '${id}' because it contains operations`); }

  groups.delete(id);
}

export function operationsMove(groupId, operationIds) {
  return operationsSetField(operationIds, 'group', groupId);
}

export function operationsSetNote(note, operationIds) {
  return operationsSetField(operationIds, 'note', note);
}

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

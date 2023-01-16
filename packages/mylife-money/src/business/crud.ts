'use strict';

const { getStoreCollection, notifyView, createLogger } = require('mylife-tools-server');

const logger = createLogger('mylife:money:business:crud');

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

export function deleteGroup(id: string) {
  logger.debug(`drop group '${id}'`);

  const groups = getStoreCollection('groups');
  const operations = getStoreCollection('operations');

  const group = groups.get(id);

  const hierarchyGroupsArray = [group];
  fillChildrenGroups(hierarchyGroupsArray, id);
  const hierarchyGroupIds = new Set(hierarchyGroupsArray.map(group => group._id));

  // move operations (of the whole hierarchy) to parent, or unsorted (null) if group was at root
  // move rules (of the whole hierarchy) to parent, or drop if group was at root
  // drop all children groups

  const childrenOperations = operations.filter(operation => hierarchyGroupIds.has(operation.group));

  logger.debug(`found groups hierarchy: ${JSON.stringify(hierarchyGroupsArray.map(grp => grp._id))}`);
  logger.debug(`found children operations: ${JSON.stringify(childrenOperations.map(op => op._id))}`);

  for (const operation of childrenOperations) {
    operations.set(operations.entity.setValues(operation, { group: group.parent }));
  }

  if (group.parent) {
    const parentGroup = groups.get(group.parent);

    let newParentRules = [...parentGroup.rules];

    for (const group of hierarchyGroupsArray) {
      newParentRules = newParentRules.concat(group.rules);
    }

    groups.set(groups.entity.setValues(parentGroup, { rules: newParentRules }));
  }

  for (const group of hierarchyGroupsArray) {
    groups.delete(group._id);
  }
}

function fillChildrenGroups(array, groupId: string) {
  const groups = getStoreCollection('groups');

  for (const group of groups.filter(group => group.parent === groupId)) {
    array.push(group);
    fillChildrenGroups(array, group._id);
  }
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

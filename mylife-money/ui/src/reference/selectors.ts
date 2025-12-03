import { createSelector } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { Group } from '../api';
import { getAccountsView, getGroupsView } from './views';

const getAccountView = getAccountsView;

export const getAccounts = createSelector([getAccountView], (view) => Object.values(view));

export const getAccount = (state, accountId: string) => getAccountView(state)[accountId];

const defaultGroup: Group = {
  _id: null,
  _entity: 'group',
  parent: null,
  display: 'Non triés',
  rules: [],
};

const getGroupView = createSelector([getGroupsView], (view) => ({ ...view, ['null']: defaultGroup }) as views.View<Group>);

export const getGroup = (state, groupId: string) => getGroupView(state)[groupId];

export const getChildrenView = createSelector([getGroupView], (view) => {
  const childrenView: { [groupId: string]: Group[] } = {};

  for (const id of Object.keys(view)) {
    const group = view[id];
    const parentId = group.parent || 'root';
    if (!childrenView[parentId]) {
      childrenView[parentId] = [];
    }
    childrenView[parentId].push(group);
  }

  return childrenView;
});

export const makeGetSortedChildren = () =>
  createSelector([getChildrenView, (_state, groupId: string) => groupId], (chlidrenView, groupId) => {
    if (!groupId) {
      // Non triés
      return [];
    }

    const groups = chlidrenView[groupId] || [];
    return groups.slice().sort((a, b) => a.display.localeCompare(b.display));
  });

// stack from root for each group
export const getGroupStacks = createSelector([getGroupView], (view) => {
  const groupStacks: { [groupId: string]: Group[] } = {};

  groupStacks['null'] = [view['null']];

  for (const id of Object.keys(view)) {
    if (id == 'null') {
      continue;
    }

    const stack: Group[] = [];
    let value = id;
    while (value) {
      const iterGroup = view[value];
      if (!iterGroup) {
        // broken structure ?
        break;
      }

      stack.push(iterGroup);
      value = iterGroup.parent;
    }
    stack.reverse();

    groupStacks[id] = stack;
  }

  return groupStacks;
});

export const getGroupStack = (state, groupId: string) => getGroupStacks(state)[groupId];

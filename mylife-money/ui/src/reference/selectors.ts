import { createSelector } from '@reduxjs/toolkit';
import { api, views } from 'mylife-tools';
import { ACCOUNTS, GROUPS } from './view-ids';

type FIXME_any = any;

const getAccountView = (state) => views.getViewByUid(state, ACCOUNTS);

export const getAccounts = createSelector([getAccountView], (view) => Object.values(view));

export const getAccount = (state, accountId: string) => getAccountView(state)[accountId];

const defaultGroup = {
  _id: null,
  _entity: 'group',
  display: 'Non triés',
};

const getGroupView = createSelector([(state) => views.getViewByUid(state, GROUPS)], (view) => ({ ...view, ['null']: defaultGroup }) as views.View<api.Entity>);

export const getGroup = (state, groupId: string) => getGroupView(state)[groupId];

export const getChildrenView = createSelector([getGroupView], (view) => {
  const childrenView: { [groupId: string]: api.Entity[] } = {};

  for (const id of Object.keys(view)) {
    const group = view[id] as FIXME_any;
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
    return groups.slice().sort((a, b) => (a as FIXME_any).display.localeCompare((b as FIXME_any).display));
  });

// stack from root for each group
export const getGroupStacks = createSelector([getGroupView], (view) => {
  // Entity => Group
  const groupStacks: { [groupId: string]: api.Entity[] } = {};

  groupStacks['null'] = [view['null']];

  for (const id of Object.keys(view)) {
    if (id == 'null') {
      continue;
    }

    // Entity => Group
    const stack: api.Entity[] = [];
    let value = id;
    while (value) {
      const iterGroup = view[value];
      if (!iterGroup) {
        // broken structure ?
        break;
      }

      stack.push(iterGroup);
      value = (iterGroup as FIXME_any).parent;
    }
    stack.reverse();

    groupStacks[id] = stack;
  }

  return groupStacks;
});

export const getGroupStack = (state, groupId: string) => getGroupStacks(state)[groupId];

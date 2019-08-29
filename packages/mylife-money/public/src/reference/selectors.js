'use strict';

import { io, immutable, createSelector } from 'mylife-tools-ui';

const getAccountViewId = state => state.reference.accounts;
const getGroupViewId = state => state.reference.groups;

export const getAccounts = (state) => io.getViewList(state, getAccountViewId(state));
export const getAccount  = (state, { account }) => io.getViewItem(state, getAccountViewId(state), account);

const defaultGroup = Object.freeze({
  _id     : null,
  display : 'Non triés'
});

const getGroupView = createSelector([ state => io.getView(state, getGroupViewId(state)) ], view => view.set(null, defaultGroup));

export const getGroups = (state) => getGroupView(state).valueSeq().toArray();
export const getGroup  = (state, { group }) => getGroupView(state).get(group);

const getChildren = (state, { group }) => {
  if(!group) {
    return getGroupView(state).filter(it => !it.parent); // Root elements
  } else if (!group._id) {
    return new immutable.Map(); // Non tries -> no children
  } else {
    return getGroupView(state).filter(it => it.parent === group._id);
  }
};

export const makeGetSortedChildren = () => createSelector(
  [ getChildren ],
  (groups) => groups.valueSeq().sortBy(it => it.display).toArray()
);

export const getChildrenList = (state, { group }) => {
  if(!group) {
    return [];
  }
  return getGroupView(state).filter(it => it.parent === group).keySeq().toArray();
};

// stack from root for each group
export const getGroupStacks = createSelector([ getGroups ], groups => {
  const groupStacks = new Map();

  groupStacks.set(null, [ groups.find(g => !g._id) ]);

  for(const group of groups) {
    if(!group._id) { continue; }

    const stack = [];
    let value = group._id;
    while(value) {
      const iterGroup = groups.find(g => g._id === value); // use map ?
      if(!iterGroup) { break; } // broken structure ?
      stack.push(iterGroup);
      value = iterGroup.parent;
    }
    stack.reverse();

    groupStacks.set(group._id, stack);
  }

  return new immutable.Map(groupStacks);
});

export const getGroupStack = (state, { group }) => getGroupStacks(state).get(group);

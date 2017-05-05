'use strict';

import Immutable from 'immutable';
import { createSelector } from 'reselect';

export const getGroups = (state) => state.groups.toArray();
export const getGroup  = (state, { group }) => state.groups.get(group);

export const getChildren = (state, props) => {
  if(!props.group) {
    return state.groups.filter(it => !it.parent); // Root elements
  } else if (!props.group.id) {
    return Immutable.Map(); // Non tries -> no children
  } else {
    return state.groups.filter(it => it.parent === props.group.id);
  }
};

export const makeGetSortedChildren = () => createSelector(
  [ getChildren ],
  (groups) => groups.sortBy(it => it.display).toArray()
);

export const getGroupAndChildrenIds = (state, props) => {
  if(!props.group) { return [null]; }

  const groups = getGroups(state);
  const ids    = [];
  children(props.group);
  return ids;

  function children(id) {
    ids.push(id);
    for(const child of groups.filter(g => g.parent === id).map(g => g.id)) {
      children(child);
    }
  }
};

function createGroupBags(groups) {
  const groupBags = new Map();

  groupBags.set(null, new Set([ null ]));

  function children(bag, id) {
    bag.add(id);
    for(const child of groups.filter(g => g.parent === id)) {
      children(bag, child.id);
    }
  }

  for(const group of groups) {
    if(!group.id) { continue; }

    const bag = new Set();
    children(bag, group.id);
    groupBags.set(group.id, bag);
  }

  return groupBags;
}

// bag of group children for each group
export const makeGetGroupBags = () => createSelector([ getGroups ], createGroupBags);

function createGroupStacks(groups) {
  const groupStacks = new Map();

  groupStacks.set(null, [ groups.find(g => !g.id) ]);

  for(const group of groups) {
    if(!group.id) { continue; }

    const stack = [];
    let value = group.id;
    while(value) {
      const iterGroup = groups.find(g => g.id === value); // use map ?
      if(!iterGroup) { break; } // broken structure ?
      stack.push(iterGroup);
      value = iterGroup.parent;
    }
    stack.reverse();

    groupStacks.set(group.id, stack);
  }

  return groupStacks;
}

// stack from root for each group
export const makeGetGroupStacks = () => createSelector([ getGroups ], createGroupStacks);

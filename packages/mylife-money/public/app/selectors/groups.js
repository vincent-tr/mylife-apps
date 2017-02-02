'use strict';

import Immutable from 'immutable';
import { createSelector } from 'reselect';

export const getGroups          = (state) => state.groups.list;
export const getGroup           = (state, { group }) => getGroups(state).get(group);
export const getSelectedGroupId = (state) => state.groups.selected;

export const getChildren = (state, props) => {
  if(!props.group) {
    return getGroups(state).filter(it => !it.parent); // Root elements
  } else if (!props.group.id) {
    return Immutable.Map(); // Non tries -> no children
  } else {
    return getGroups(state).filter(it => it.parent === props.group.id);
  }
};

export const makeGetSortedChildren = () => createSelector(
  [ getChildren ],
  (groups) => groups.sortBy(it => it.display).toArray()
);

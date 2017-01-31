'use strict';

import { createSelector } from 'reselect';

export const getGroups   = (state) => state.groups;
export const getGroup    = (state, { group }) => state.groups.get(group);
export const getChildren = (state, props) => getGroups(state).filter(it =>  props.group ? (it.parent === props.group.id) : !it.parent);

export const makeGetSortedChildren = () => createSelector(
  [ getChildren ],
  (groups) => groups.sortBy(it => it.display).toArray()
);

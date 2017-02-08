'use strict';

import { createSelector } from 'reselect';

export const getAllOperations     = (state) => state.management.operations.all.toArray();
export const getVisibleOperations = (state) => state.management.operations.visible.toArray().map(id => state.management.operations.all.get(id));
export const getSelectedOperations = (state) => state.management.operations.visible.toArray().map(id => state.management.operations.all.get(id));
export const getSelectedGroupId   = (state) => state.management.selectedGroup;

export const getSortedVisibleOperations = createSelector(
  [ getVisibleOperations ],
  (operations) => {
    const ret = operations.slice();
    ret.sort((op1, op2) => {
      let comp = op1.date - op2.date;
      if(comp) { return comp; }
      return op1.id - op2.id; // consistency
    });
    return ret;
  }
);

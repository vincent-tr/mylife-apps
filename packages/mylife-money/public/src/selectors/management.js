'use strict';

import { createSelector } from 'mylife-tools-ui';

export const getAllOperations        = (state) => state.management.operations.all.valueSeq().toArray();
export const getVisibleOperationIds  = (state) => state.management.operations.visible.valueSeq().toArray();
export const getVisibleOperations    = (state) => getVisibleOperationIds(state).map(id => state.management.operations.all.get(id));
export const getSelectedOperationIds = (state) => state.management.operations.selected.valueSeq().toArray();
export const getSelectedOperations   = (state) => getSelectedOperationIds(state).map(id => state.management.operations.all.get(id));
export const getSelectedGroupId      = (state) => state.management.selectedGroup;

export const getFilters = (state) => {
  const { minDate, maxDate, account } = state.management;
  return { minDate, maxDate, account };
};

export const getSortedVisibleOperations = createSelector(
  [ getVisibleOperations ],
  (operations) => {
    const ret = operations.slice();
    ret.sort((op1, op2) => {
      let comp = op1.date - op2.date;
      if(comp) { return comp; }
      return op1._id - op2._id; // consistency
    });
    return ret;
  }
);

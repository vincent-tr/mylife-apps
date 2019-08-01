'use strict';

import { io, createSelector } from 'mylife-tools-ui';

export const getOperationViewId = state => state.management.operations.view;
const getOperationView = state => io.getView(state, getOperationViewId(state));
const getOperationList = state => io.getViewList(state, getOperationViewId(state));

export const getSelectedOperationIds = state => state.management.operations.selected.valueSeq().toArray();

export const getSelectedOperations = state => {
  const view = getOperationView(state);
  return getSelectedOperationIds(state).map(id => view.get(id));
};

export const getSelectedGroupId = (state) => state.management.group;

export const getFilters = (state) => {
  const { minDate, maxDate, account, group } = state.management;
  return { minDate, maxDate, account, group };
};

export const getSortedOperations = createSelector(
  [ getOperationList ],
  (operations) => {
    const ret = Array.from(operations);
    ret.sort((op1, op2) => {
      let comp = op1.date - op2.date;
      if(comp) { return comp; }
      return op1._id - op2._id; // consistency
    });
    return ret;
  }
);

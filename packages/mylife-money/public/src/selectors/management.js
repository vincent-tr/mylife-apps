'use strict';

import { io, createSelector } from 'mylife-tools-ui';

export const getOperationViewId = state => state.management.operations.view;
const getOperationView = state => io.getView(state, getOperationViewId(state));
const getOperationList = state => io.getViewList(state, getOperationViewId(state));
export const isOperationDetail = state => !!state.management.operations.detail;
export const getOperationIdDetail = state => state.management.operations.detail;
export const getOperationDetail = state => getOperationView(state).get(state.management.operations.detail);

// ensure that we only provide operations that are possible (selected operations are not refreshed when the operation view is)
const getSelectedOperationSet = state => state.management.operations.selected.intersect(getOperationView(state).keySeq());

export const getOperationIds = state => getOperationView(state).keySeq().toArray();
export const getSelectedOperationIds = state => getSelectedOperationSet(state).valueSeq().toArray();

export const getSelectedOperations = state => {
  const view = getOperationView(state);
  return getSelectedOperationIds(state).map(id => view.get(id));
};

export const getCriteria = state => state.management.criteria;
export const getSelectedGroupId = state => getCriteria(state).group;

export const getSortedOperations = createSelector(
  [ getOperationList ],
  (operations) => {
    const ret = Array.from(operations);
    ret.sort((op1, op2) => {
      let comp = op1.date - op2.date;
      if(comp) { return comp; }
      return op1._id < op2._id ? -1 : 1; // consistency
    });
    return ret;
  }
);

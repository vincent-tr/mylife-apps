'use strict';

import { io, createSelector } from 'mylife-tools-ui';

export const getOperations = (state) => state.reporting.operations.valueSeq().toArray();
export const getViewId = (state) => state.reporting.view;
export const getView = state => io.getView(state, getViewId(state));
export const getViewList = state => io.getViewList(state, getViewId(state));

// sort on id, should be usefull with report's custom keys
export const getSortedViewList = createSelector(
  [ getViewList ],
  (items) => {
    const ret = Array.from(items);
    ret.sort((item1, item2) => item1._id < item2._id ? -1 : 1);
    return ret;
  }
);

'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrSkipView, deleteView } from '../action-tools';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchStats = () => createOrSkipView({
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'stat',
  method: 'notify'
});

const clearStats = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshStatsImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchStats());
  } else {
    await dispatch(clearStats());
  }
}

const refreshStats = createDebouncedRefresh(refreshStatsImpl);

export const refStatView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshStats(dispatch, prevRef, currentRef);
};

export const unrefStatView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshStats(dispatch, prevRef, currentRef);
};

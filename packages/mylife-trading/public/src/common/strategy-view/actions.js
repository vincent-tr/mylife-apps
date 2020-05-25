'use strict';

import { views, createAction } from 'mylife-tools-ui';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchStrategies = () => views.createOrSkipView({
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'strategy',
  method: 'notify'
});

const clearStrategies = () => views.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshStrategiesImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchStrategies());
  } else {
    await dispatch(clearStrategies());
  }
}

const refreshStrategies = createDebouncedRefresh(refreshStrategiesImpl);

export const refStrategyView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshStrategies(dispatch, prevRef, currentRef);
};

export const unrefStrategyView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshStrategies(dispatch, prevRef, currentRef);
};

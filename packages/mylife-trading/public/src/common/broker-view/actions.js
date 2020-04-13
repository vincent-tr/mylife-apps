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

const fetchBrokers = () => createOrSkipView({
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'broker',
  method: 'notify'
});

const clearBrokers = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshBrokersImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchBrokers());
  } else {
    await dispatch(clearBrokers());
  }
}

const refreshBrokers = createDebouncedRefresh(refreshBrokersImpl);

export const refBrokerView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshBrokers(dispatch, prevRef, currentRef);
};

export const unrefBrokerView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshBrokers(dispatch, prevRef, currentRef);
};

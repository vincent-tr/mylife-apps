'use strict';

import { io, createAction } from 'mylife-tools-ui';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchErrors = () => io.createOrSkipView({
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'error',
  method: 'notify'
});

const clearErrors = () => io.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshErrorsImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchErrors());
  } else {
    await dispatch(clearErrors());
  }
}

const refreshErrors = createDebouncedRefresh(refreshErrorsImpl);

export const refErrorView = () => (dispatch, getErrore) => {
  const prevRef = getRefCount(getErrore());
  dispatch(local.ref());
  const currentRef = getRefCount(getErrore());
  refreshErrors(dispatch, prevRef, currentRef);
};

export const unrefErrorView = () => (dispatch, getErrore) => {
  const prevRef = getRefCount(getErrore());
  dispatch(local.unref());
  const currentRef = getRefCount(getErrore());
  refreshErrors(dispatch, prevRef, currentRef);
};

'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../action-tools';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchKeywords = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'keyword',
  method: 'notifyKeywords'
});

const clearKeywords = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshKeywordsImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchKeywords());
  } else {
    await dispatch(clearKeywords());
  }
}

const refreshKeywords = createDebouncedRefresh(refreshKeywordsImpl);

export const refKeywordView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshKeywords(dispatch, prevRef, currentRef);
};

export const unrefKeywordView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshKeywords(dispatch, prevRef, currentRef);
};

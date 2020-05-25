'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import { createDebouncedRefresh } from '../ref-view-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchPersons = () => views.createOrUpdateView({
  criteriaSelector: () => ({ criteria: {} }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'person',
  method: 'notifyPersons'
});

const clearPersons = () => io.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});


async function refreshPersonsImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchPersons());
  } else {
    await dispatch(clearPersons());
  }
}

const refreshPersons = createDebouncedRefresh(refreshPersonsImpl);

export const refPersonView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshPersons(dispatch, prevRef, currentRef);
};

export const unrefPersonView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshPersons(dispatch, prevRef, currentRef);
};

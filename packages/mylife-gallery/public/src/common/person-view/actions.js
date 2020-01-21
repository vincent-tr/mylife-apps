'use strict';

import { Mutex } from 'async-mutex';
import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../action-tools';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const local = {
  ref: createAction(actionTypes.REF),
  unref: createAction(actionTypes.UNREF),
  setView: createAction(actionTypes.SET_VIEW),
};

const fetchPersons = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'person',
  method: 'notifyPersons'
});

const clearPersons = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

// needed  because fetchPersons/clearPersons is not atomic
const mutex = new Mutex();

export const refPersonView = () => async (dispatch, getState) => {
  await mutex.runExclusive(async () => {

    dispatch(local.ref());

    if(getRefCount(getState()) === 1) {
      // first ref, need to actually fetch it
      await dispatch(fetchPersons());
    }

  });
};

export const unrefPersonView = () => async (dispatch, getState) => {
  await mutex.runExclusive(async () => {

    dispatch(local.unref());

    if(getRefCount(getState()) === 0) {
      // last ref, clear
      await dispatch(clearPersons());
    }

  });
};

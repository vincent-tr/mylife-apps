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

const fetchAlbums = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'album',
  method: 'notifyAlbums'
});

const clearAlbums = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

// needed  because fetchAlbums/clearAlbums is not atomic
const mutex = new Mutex();

export const refAlbumView = () => async (dispatch, getState) => {
  dispatch(local.ref());

  if(getRefCount(getState()) === 1) {
    // first ref, need to actually fetch it
    await dispatch(fetchAlbums());
  }
};

export const unrefAlbumView = () => async (dispatch, getState) => {
  dispatch(local.unref());

  if(getRefCount(getState()) === 0) {
    // last ref, clear
    await dispatch(clearAlbums());
  }
};

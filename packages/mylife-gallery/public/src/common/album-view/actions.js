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

const fetchAlbums = () => views.createOrUpdateView({
  criteriaSelector: () => ({ criteria: {}}),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'album',
  method: 'notifyAlbums'
});

const clearAlbums = () => views.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

async function refreshAlbumsImpl(dispatch, oldRefCount, newRefCount) {
  const wasRef = oldRefCount > 0;
  const isRef = newRefCount > 0;
  if(wasRef === isRef) {
    return;
  }

  if(isRef) {
    await dispatch(fetchAlbums());
  } else {
    await dispatch(clearAlbums());
  }
}

const refreshAlbums = createDebouncedRefresh(refreshAlbumsImpl);

export const refAlbumView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.ref());
  const currentRef = getRefCount(getState());
  refreshAlbums(dispatch, prevRef, currentRef);
};

export const unrefAlbumView = () => (dispatch, getState) => {
  const prevRef = getRefCount(getState());
  dispatch(local.unref());
  const currentRef = getRefCount(getState());
  refreshAlbums(dispatch, prevRef, currentRef);
};

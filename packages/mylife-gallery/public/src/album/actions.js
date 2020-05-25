'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getAlbumId, getAlbumViewId, getDocumentViewId } from './selectors';

const local = {
  setAlbumId: createAction(actionTypes.SET_ALBUM_ID),
  setAlbumView: createAction(actionTypes.SET_ALBUM_VIEW),
  setDocumentView: createAction(actionTypes.SET_DOCUMENT_VIEW),
  showDetail: createAction(actionTypes.SHOW_DETAIL),
};

export const showDetail = local.showDetail;

const fetchAlbum = () => views.createOrUpdateView({
  criteriaSelector: (state) => ({ id: getAlbumId(state) }),
  viewSelector: getAlbumViewId,
  setViewAction: local.setAlbumView,
  service: 'album',
  method: 'notifyAlbum'
});

const clearAlbums = () => views.deleteView({
  viewSelector: getAlbumViewId,
  setViewAction: local.setAlbumView
});

const fetchDocuments = () => views.createOrUpdateView({
  criteriaSelector: (state) => ({ criteria: { albums: [getAlbumId(state)] } }),
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView,
  service: 'document',
  method: 'notifyDocumentsWithInfo'
});

const clearDocuments = () => views.deleteView({
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView
});

export const deleteAlbum = (album) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'deleteAlbum',
      id: album._id
    }));

  };
};

export const updateAlbum = (album, values) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'album',
      method: 'updateAlbum',
      id: album._id,
      values
    }));

  };
};

export const enter = (albumId) => async (dispatch) => {
  dispatch(local.setAlbumId(albumId));
  await dispatch(fetchAlbum());
  await dispatch(fetchDocuments());
};

export const leave = () => async (dispatch) => {
  dispatch(local.setAlbumId(null));
  await dispatch(clearAlbums());
  await dispatch(clearDocuments());
};

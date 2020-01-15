'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getAlbumId, getAlbumViewId, getDocumentViewId } from './selectors';

const local = {
  setAlbumId: createAction(actionTypes.SET_ALBUM_ID),
  setAlbumView: createAction(actionTypes.SET_ALBUM_VIEW),
  setDocumentView: createAction(actionTypes.SET_DOCUMENT_VIEW),
};

const fetchAlbum = () => createOrUpdateView({
  criteriaSelector: (state) => ({ id: getAlbumId(state) }),
  viewSelector: getAlbumViewId,
  setViewAction: local.setAlbumView,
  service: 'album',
  method: 'notifyAlbum'
});

const clearAlbums = () => deleteView({
  viewSelector: getAlbumViewId,
  setViewAction: local.setAlbumView
});

const fetchDocuments = () => createOrUpdateView({
  criteriaSelector: (state) => ({ criteria: { albums: [getAlbumId(state)] } }),
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView,
  service: 'document',
  method: 'notifyDocumentsWithInfo'
});

const clearDocuments = () => deleteView({
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView
});

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

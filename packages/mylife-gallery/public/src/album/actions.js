'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getAlbumId } from './selectors';
import { ALBUM_VIEW, DOCUMENT_VIEW } from './view-ids';

const albumViewRef = new views.ViewReference({
  uid: ALBUM_VIEW,
  criteriaSelector: (state) => ({ id: getAlbumId(state) }),
  service: 'album',
  method: 'notifyAlbum',
  canUpdate: true
});

const documentViewRef = new views.ViewReference({
  uid: DOCUMENT_VIEW,
  criteriaSelector: (state) => ({ criteria: { albums: [getAlbumId(state)] } }),
  service: 'document',
  method: 'notifyDocumentsWithInfo',
  canUpdate: true
});

const setAlbumId = createAction(actionTypes.SET_ALBUM_ID);
export const showDetail = createAction(actionTypes.SHOW_DETAIL);

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
  dispatch(setAlbumId(albumId));
  await albumViewRef.attach();
  await documentViewRef.attach();
};

export const leave = () => async (dispatch) => {
  dispatch(setAlbumId(null));
  await albumViewRef.detach();
  await documentViewRef.detach();
};

'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { ALBUM_VIEW, DOCUMENT_VIEW } from './view-ids';

const albumViewRef = new views.ViewReference({
  uid: ALBUM_VIEW,
  criteriaSelector: (state, { albumId }) => ({ id: albumId }),
  service: 'album',
  method: 'notifyAlbum',
  canUpdate: true
});

const documentViewRef = new views.ViewReference({
  uid: DOCUMENT_VIEW,
  criteriaSelector: (state, { albumId }) => ({ criteria: { albums: [albumId] } }),
  service: 'document',
  method: 'notifyDocumentsWithInfo',
  canUpdate: true
});

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
  await albumViewRef.attach({ albumId });
  await documentViewRef.attach({ albumId });
};

export const leave = () => async (dispatch) => {
  await albumViewRef.detach();
  await documentViewRef.detach();
};

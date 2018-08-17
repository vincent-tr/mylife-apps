'use strict';

import { createAction } from 'redux-actions';
import actionTypes from '../constants/action-types';
import { push } from 'connected-react-router';
import { getAlbums, getAlbum } from '../selectors';

const loadAlbums = createAction(actionTypes.FETCH_ALBUMS);
const loadAlbum = createAction(actionTypes.FETCH_ALBUM);
const setDetail = createAction(actionTypes.SET_DETAIL);

export const ensureAlbums = cb => (dispatch, getState) => {
  const state = getState();
  if(getAlbums(state)) {
    return;
  }

  dispatch(loadAlbums({ cb }));
};

export const ensureAlbum = (albumName, cb) => (dispatch, getState) => {
  const state = getState();
  const album = getAlbum(state);
  if(album && album.name === albumName) {
    cb && cb();
    return;
  }

  dispatch(loadAlbum({ albumName, cb }));
};

export const ensureDetail = (albumName, imageId, cb) => (dispatch, getState) => {
  dispatch(ensureAlbum(albumName, err => {
    if(err) {
      cb && cb(err);
      return;
    }

    loadDetail(dispatch, getState, imageId);
    cb && cb();
  }));
};

function loadDetail(dispatch, getState, imageId) {
  const state = getState();
  const album = getAlbum(state);
  const item = album.items.find(item => item.id === imageId);
  dispatch(setDetail(item));
}

export const showAlbum = name => push(`/album/${name || '<unset>'}`);
export const hideAlbum = () => push('/');

export const showDetail = (item) => (dispatch, getState) => {
  const state = getState();
  const album = getAlbum(state);
  dispatch(push(`/image/${album.name || '<unset>'}/${item.id}`));
};

export const hideDetail = () => (dispatch, getState) => {
  const state = getState();
  const album = getAlbum(state);
  dispatch(push(`/album/${album.name || '<unset>'}`));
};
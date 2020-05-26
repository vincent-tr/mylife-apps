'use strict';

import { io, views, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getSelectedId } from './selectors';
import { VIEW } from './view-ids';

const viewRef = new views.ViewReference({
  uid: VIEW,
  service: 'slideshow',
  method: 'notifySlideshows'
});

const setSelected = createAction(actionTypes.SET_SELECTED);

export const changeSelected = setSelected;

export const createSlideshow = (name) => {
  return async (dispatch) => {

    const slideshow = await dispatch(io.call({
      service: 'slideshow',
      method: 'createSlideshow',
      values: { name }
    }));

    dispatch(setSelected(slideshow._id));
  };
};

export const deleteSlideshow = (id) => {
  return async (dispatch, getState) => {

    const state = getState();
    const selectedId = getSelectedId(state);
    if(selectedId === id) {
      dispatch(setSelected(null));
    }

    await dispatch(io.call({
      service: 'slideshow',
      method: 'deleteSlideshow',
      id
    }));
  };
};

export const updateSlideshow = (slideshow, values) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'slideshow',
      method: 'updateSlideshow',
      id: slideshow._id,
      values
    }));
  };
};

export function addAlbumToSlideshow(slideshow, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'slideshow',
      method: 'addAlbumToSlideshow',
      id: slideshow._id,
      albumId: album._id
    }));

  };
}

export function removeAlbumFromSlideshow(slideshow, album) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'slideshow',
      method: 'removeAlbumFromSlideshow',
      id: slideshow._id,
      albumId: album._id
    }));

  };
}

export function moveAlbumInSlideshow(slideshow, oldIndex, newIndex) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'slideshow',
      method: 'moveAlbumInSlideshow',
      id: slideshow._id,
      oldIndex,
      newIndex
    }));

  };
}

export const enter = () => async (dispatch) => {
  dispatch(setSelected(null));
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  dispatch(setSelected(null));
  await viewRef.detach();
};

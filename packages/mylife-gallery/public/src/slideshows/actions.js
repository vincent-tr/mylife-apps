'use strict';

import { io, createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId, getSelectedId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  setSelected: createAction(actionTypes.SET_SELECTED)
};

const getSlideshows = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'slideshow',
  method: 'notifySlideshows'
});

const clearSlideshows = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const changeSelected = local.setSelected;

export const createSlideshow = (name) => {
  return async (dispatch) => {

    const slideshow = await dispatch(io.call({
      service: 'slideshow',
      method: 'createSlideshow',
      values: { name }
    }));

    dispatch(local.setSelected(slideshow._id));
  };
};

export const deleteSlideshow = (id) => {
  return async (dispatch, getState) => {

    const state = getState();
    const selectedId = getSelectedId(state);
    if(selectedId === id) {
      dispatch(local.setSelected(null));
    }

    await dispatch(io.call({
      service: 'slideshow',
      method: 'deleteSlideshow',
      id
    }));
  };
};

export const enter = () => async (dispatch) => {
  await dispatch(getSlideshows());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearSlideshows());
};

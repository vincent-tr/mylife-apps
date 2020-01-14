'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getCriteria, getDisplay, getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  setCriteria: createAction(actionTypes.SET_CRITERIA),
  setDisplay: createAction(actionTypes.SET_DISPLAY)
};

const getAlbums = (criteria = {}) => createOrUpdateView({
  criteriaSelector: () => ({ criteria }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'album',
  method: 'notifyAlbums'
});

const clearAlbums = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getAlbums());
};

export const leave = () => async (dispatch) => {
  dispatch(local.setDisplay(null));
  dispatch(local.setCriteria(null));
  await dispatch(clearAlbums());
};

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(local.setCriteria(newCriteria));

  await dispatch(getAlbums(newCriteria));
};

export const changeDisplay = (changes) => async (dispatch, getState) => {
  const state = getState();
  const display = getDisplay(state);
  const newDisplay = { ...display, ...changes };
  dispatch(local.setDisplay(newDisplay));
};

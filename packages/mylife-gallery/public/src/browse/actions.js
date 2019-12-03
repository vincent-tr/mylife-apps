'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getDisplay, getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  setDisplay: createAction(actionTypes.SET_DISPLAY)
};

const getDocuments = (criteria) => createOrUpdateView({
  criteriaSelector: () => ({ criteria }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'document',
  method: 'notifyDocuments'
});

const clearDocuments = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getDocuments());
};

export const leave = () => async (dispatch) => {
  dispatch(local.setDisplay(null));
  await dispatch(clearDocuments());
};

export const changeCriteria = (criteria) => async (dispatch) => {
  await dispatch(getDocuments(criteria));
};

export const changeDisplay = (changes) => async (dispatch, getState) => {
  const state = getState();
  const display = getDisplay(state);
  const newDisplay = { ...display, ...changes };
  dispatch(local.setDisplay(newDisplay));
};

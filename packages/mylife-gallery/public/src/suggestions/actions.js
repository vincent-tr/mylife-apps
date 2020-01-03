'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

const getSuggestions = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'suggestion',
  method: 'notifySuggestions'
});

const clearSuggestions = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getSuggestions());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearSuggestions());
};

'use strict';

import { views, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

const getStats = () => views.createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'stats',
  method: 'notifyStats'
});

const clearStats = () => views.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getStats());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStats());
};

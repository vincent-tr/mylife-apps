'use strict';

import { io, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

const getStats = () => io.createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'stats',
  method: 'notifyStats'
});

const clearStats = () => io.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getStats());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStats());
};

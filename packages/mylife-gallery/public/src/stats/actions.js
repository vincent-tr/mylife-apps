'use strict';

import { createAction, io } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

const getStats = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'stats',
    method: 'notifyStats',
  }));

  dispatch(local.setView(viewId));
};

const clearStats = () => async (dispatch, getState) => {
  const state = getState();
  const viewId = getViewId(state);
  if(!viewId) {
    return;
  }

  await dispatch(io.unnotify(viewId));
  dispatch(local.setView(null));
};

export const enter = () => async (dispatch) => {
  await dispatch(getStats());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStats());
};

'use strict';

import { createAction, io } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId, getCriteria } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  setCriteria: createAction(actionTypes.SET_CRITERIA),
};

const viewRef = new io.ViewReference({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'nagios',
  method: 'notify'
});

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(local.setCriteria(newCriteria));
};

export const enter = () => async (dispatch) => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
  dispatch(local.setCriteria(null));
};

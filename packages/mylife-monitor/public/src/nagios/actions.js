'use strict';

import { createAction } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId, getCriteria } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  setCriteria: createAction(actionTypes.SET_CRITERIA),
};

const getData = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'nagios',
  method: 'notify'
});

const clearData = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(local.setCriteria(newCriteria));
};

export const enter = () => async (dispatch) => {
  await dispatch(getData());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearData());
  dispatch(local.setCriteria(null));
};

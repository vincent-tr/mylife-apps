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

const getDocuments = (criteria = {}) => createOrUpdateView({
  criteriaSelector: () => ({ criteria: formatCriteria(criteria) }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'document',
  method: 'notifyDocumentsWithInfo'
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
  dispatch(local.setCriteria(null));
  await dispatch(clearDocuments());
};

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(local.setCriteria(newCriteria));

  await dispatch(getDocuments(newCriteria));
};

export const changeDisplay = (changes) => async (dispatch, getState) => {
  const state = getState();
  const display = getDisplay(state);
  const newDisplay = { ...display, ...changes };
  dispatch(local.setDisplay(newDisplay));
};

function formatCriteria(criteria) {
  const { type, albums, persons, ...others } = criteria;
  const newCriteria = {
    type: formatSet(type),
    albums: formatSet(albums),
    persons: formatSet(persons),
  };

  // only pick non-default values (lets consider falsy are default)
  for(const [key, value] of Object.entries(others)) {
    if(value) {
      newCriteria[key] = value;
    }
  }

  return newCriteria;
}

function formatSet(set) {
  if(!set || set.size === 0) {
    return;
  }
  return set.toArray();
}

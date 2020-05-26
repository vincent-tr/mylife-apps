'use strict';

import { createAction, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getCriteria, getDisplay } from './selectors';
import { VIEW } from './view-ids';

const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: (state) => ({ criteria: formatCriteria(getCriteria(state)) }),
  service: 'document',
  method: 'notifyDocumentsWithInfo'
});

const local = {
  setCriteria: createAction(actionTypes.SET_CRITERIA),
  setDisplay: createAction(actionTypes.SET_DISPLAY)
};

export const enter = () => async (dispatch) => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  dispatch(local.setDisplay(null));
  dispatch(local.setCriteria(null));
  await viewRef.detach();
};

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(local.setCriteria(newCriteria));

  await viewRef.update();
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

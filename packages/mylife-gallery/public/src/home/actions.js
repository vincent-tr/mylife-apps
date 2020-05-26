'use strict';

import { createAction, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getCriteria, getDisplay } from './selectors';
import { VIEW } from './view-ids';

const viewRef = new views.ViewReference({
  uid: VIEW,
  criteriaSelector: (state, { criteria }) => ({ criteria }),
  service: 'album',
  method: 'notifyAlbums'
});

const setCriteria = createAction(actionTypes.SET_CRITERIA);
const setDisplay = createAction(actionTypes.SET_DISPLAY);

export const enter = () => async (dispatch) => {
  await viewRef.attach({ criteria: {} });
};

export const leave = () => async (dispatch) => {
  dispatch(setDisplay(null));
  dispatch(setCriteria(null));
  await viewRef.detach();
};

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(setCriteria(newCriteria));

  await viewRef.update({ criteria: newCriteria });
};

export const changeDisplay = (changes) => async (dispatch, getState) => {
  const state = getState();
  const display = getDisplay(state);
  const newDisplay = { ...display, ...changes };
  dispatch(setDisplay(newDisplay));
};

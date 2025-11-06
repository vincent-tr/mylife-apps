'use strict';

import { createAction } from 'redux-actions';
import { views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getCriteria } from './selectors';
import * as viewUids from './view-uids';

const setCriteria = createAction(actionTypes.SET_CRITERIA);

const viewRef = new views.ViewReference({
  uid: viewUids.UPDATES_DATA,
  service: 'updates',
  method: 'notify'
});

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(setCriteria(newCriteria));
};

export const enter = () => async () => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
  dispatch(setCriteria(null));
};

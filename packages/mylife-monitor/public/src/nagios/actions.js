'use strict';

import { createAction, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getCriteria } from './selectors';
import * as viewUids from './view-uids';

const setCriteria = createAction(actionTypes.SET_CRITERIA);

const viewRef = new views.ViewReference({
  uid: viewUids.NAGIOS_DATA,
  service: 'nagios',
  method: 'notify'
});

export const changeCriteria = (changes) => async (dispatch, getState) => {
  const state = getState();
  const criteria = getCriteria(state);
  const newCriteria = { ...criteria, ...changes };
  dispatch(setCriteria(newCriteria));
};

export const enter = () => async (dispatch) => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
  dispatch(setCriteria(null));
};

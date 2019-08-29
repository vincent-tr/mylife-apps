'use strict';

import { createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { io } from 'mylife-tools-ui';

const local = {
  setAccountView: createAction(actionTypes.SET_ACCOUNT_VIEW),
  setGroupView: createAction(actionTypes.SET_GROUP_VIEW),
};

const getAccounts = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'common',
    method: 'notifyAccounts'
  }));

  dispatch(local.setAccountView(viewId));
};

const getGroups = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'common',
    method: 'notifyGroups'
  }));

  dispatch(local.setGroupView(viewId));
};

export const referenceInit = () => async (dispatch) => {
  await dispatch(getAccounts());
  await dispatch(getGroups());
};

'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { io } from 'mylife-tools-ui';

const local = {
  setAccountView: createAction(actionTypes.SET_ACCOUNT_VIEW),
  setGroupView: createAction(actionTypes.SET_GROUP_VIEW),
};

export const getAccounts = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'management',
    method: 'notifyAccounts'
  }));

  dispatch(local.setAccountView(viewId));
};

export const getGroups = () => async (dispatch) => {
  const viewId = await dispatch(io.call({
    service: 'management',
    method: 'notifyGroups'
  }));

  dispatch(local.setGroupView(viewId));
};

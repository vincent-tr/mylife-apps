'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { io } from 'mylife-tools-ui';

const local = {
  getAccounts: createAction(actionTypes.GET_ACCOUNTS),
  getGroups: createAction(actionTypes.GET_GROUPS)
};

export const getAccounts = () => async (dispatch) => {
  const data = await dispatch(io.call({
    service: 'management',
    method: 'getAccounts'
  }));

  dispatch(local.getAccounts(data));
};

export const getGroups = () => async (dispatch) => {
  const data = await dispatch(io.call({
    service: 'management',
    method: 'getGroups'
  }));

  dispatch(local.getGroups(data));
};

'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_ACCOUNT_VIEW] : (state, action) => ({
    ...state,
    accounts: action.payload
  }),

  [actionTypes.SET_GROUP_VIEW] :(state, action) => ({
    ...state,
    groups: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    accounts: null,
    groups: null
  })

}, {
  accounts: null,
  groups: null
});

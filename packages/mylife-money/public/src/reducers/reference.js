'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({

  [actionTypes.SET_ACCOUNT_VIEW] : {
    next : (state, action) => ({
      ...state,
      accounts: action.payload
    })
  },

  [actionTypes.SET_GROUP_VIEW] : {
    next : (state, action) => ({
      ...state,
      groups: action.payload
    })
  }

}, {
  accounts: null,
  groups: null
});

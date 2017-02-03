'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';

export default handleActions({
  [actionTypes.MANAGEMENT_SET_MIN_DATE] : {
    next : (state, action) => ({ ...state, minDate: action.payload })
  },

  [actionTypes.MANAGEMENT_SET_MAX_DATE] : {
    next : (state, action) => ({ ...state, maxDate: action.payload })
  },

  [actionTypes.MANAGEMENT_SET_ACCOUNT] : {
    next : (state, action) => ({ ...state, account: action.payload })
  },

}, {
  minDate: new Date(new Date().getFullYear(), 0, 1),
  maxDate: null,
  account: null
});

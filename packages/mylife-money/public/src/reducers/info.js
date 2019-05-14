'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';

export default handleActions({

  [actionTypes.CLEAR_INFO] : {
    next : () => null
  },

  [actionTypes.SHOW_INFO] : {
    next : (state, action) => action.payload
  },

}, null);

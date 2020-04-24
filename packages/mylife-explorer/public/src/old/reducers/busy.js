'use strict';

import { handleActions } from 'redux-actions';
import actionTypes       from '../constants/action-types';

export default handleActions({

  [actionTypes.BUSY_SET] : {
    next : () => true
  },

  [actionTypes.BUSY_CLEAR] : {
    next : () => false
  },

}, false);

'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({

  [actionTypes.CLEAR_INFO] : {
    next : () => null
  },

  [actionTypes.SHOW_INFO] : {
    next : (state, action) => action.payload
  },

}, null);

'use strict';

import { handleActions } from 'redux-actions';
import actionTypes from '../constants/action-types';

export default handleActions({

  [actionTypes.SET_ALBUM] : {
    next : (state, action) => action.payload
  },

}, null);

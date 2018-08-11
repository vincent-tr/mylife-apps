'use strict';

import { handleActions } from 'redux-actions';
import actionTypes from '../constants/action-types';

export default handleActions({

  [actionTypes.SET_GRID] : {
    next : (state, action) => action.payload
  },

}, []);

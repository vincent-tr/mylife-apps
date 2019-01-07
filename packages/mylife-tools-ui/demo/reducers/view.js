'use strict';

import { handleActions } from 'redux-actions';
import actionTypes from '../constants/action-types';

export default handleActions({

  [actionTypes.VIEW_SET] : {
    next : (state, action) => {
      return action.payload;
    }
  },

}, 'main');

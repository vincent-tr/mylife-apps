'use strict';

import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

const defaultState = {
  location : null,
  action : null
};

export default handleActions({

  [actionTypes.LOCATION_CHANGE] : (state, action) => ({
    ...state,
    ...action.payload
  }),

}, defaultState);

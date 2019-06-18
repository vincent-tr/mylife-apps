'use strict';

import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

const defaultState = {
  online : false,
};

export default handleActions({

  [actionTypes.SET_ONLINE] : (state, action) => ({
    ...state,
    online: action.payload
  }),

}, defaultState);

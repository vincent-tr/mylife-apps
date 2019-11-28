'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_OPERATION_STATS_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  })

}, {
  viewId: null,
});

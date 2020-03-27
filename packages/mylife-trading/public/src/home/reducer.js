'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_STRATEGY_VIEW] : (state, action) => ({
    ...state,
    strategyViewId: action.payload,
  }),

  [actionTypes.SET_STRATEGY_STATUS_VIEW] : (state, action) => ({
    ...state,
    strategyStatusViewId: action.payload,
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    strategyViewId: null,
    strategyStatusViewId: null,
  })

}, {
  strategyViewId: null,
  strategyStatusViewId: null,
});

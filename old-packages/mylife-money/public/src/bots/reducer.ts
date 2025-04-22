'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_RUNS_VIEW] : (state, action) => ({
    ...state,
    runsView: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    runsView: null
  })

}, {
  runsView: null,
});

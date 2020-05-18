'use strict';

import { handleActions, io } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_NAGIOS_VIEW] : (state, action) => ({
    ...state,
    nagiosViewId: action.payload
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    nagiosViewId: null
  })

}, {
  nagiosViewId: null,
});

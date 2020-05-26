'use strict';

import { handleActions, routing } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SHOW_DETAIL] : (state, action) => ({
    ...state,
    showDetail: action.payload
  }),

  [routing.actionTypes.LOCATION_CHANGE] : (state) => ({
    ...state,
    showDetail: true
  }),

}, {
  showDetail: true
});

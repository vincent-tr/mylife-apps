'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({

  [actionTypes.HOME_SET_OPERATION_STATS_VIEW] : (state, action) => ({
    ...state,
    stats: action.payload
  }),

  [actionTypes.HOME_SET_TOTAL_BY_MONTH_VIEW] : (state, action) => ({
    ...state,
    totalByMonth: action.payload
  }),

}, {
  stats: null,
  totalByMonth: null
});

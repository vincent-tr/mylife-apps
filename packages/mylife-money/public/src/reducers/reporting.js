'use strict';

import { handleActions, routing } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { immutable } from 'mylife-tools-ui';

export default handleActions({

  [actionTypes.REPORTING_GET_OPERATIONS] : {
    next : (state, action) => ({
      ...state,
      operations: state.operations.withMutations(map => {
        map.clear();
        for(const operation of action.payload) {
          map.set(operation._id, operation);
        }
      }),
    })
  },

  [actionTypes.REPORTING_SET_OPERATION_STATS_VIEW] : {
    next : (state, action) => ({
      ...state,
      stats: action.payload
    })
  },

  [actionTypes.REPORTING_SET_TOTAL_BY_MONTH_VIEW] : {
    next : (state, action) => ({
      ...state,
      totalByMonth: action.payload
    })
  },

  [routing.actionTypes.LOCATION_CHANGE] : {
    next : (state) => ({
      ...state,
      operations: state.operations.clear(),
    })
  },

}, {
  operations : new immutable.Map(),
  stats: null,
  totalByMonth: null
});

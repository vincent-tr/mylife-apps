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

  [routing.actionTypes.LOCATION_CHANGE] : {
    next : (state) => ({
      ...state,
      operations: state.operations.clear(),
    })
  },

  [actionTypes.REPORTING_SET_VIEW] : {
    next : (state, action) => ({
      ...state,
      view: action.payload
    })
  },

}, {
  operations : new immutable.Map(),
  view: null,
});

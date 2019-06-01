'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.REPORTING_GET_OPERATIONS] : {
    next : (state, action) => ({
      ...state,
      operations: state.operations.withMutations(map => {
        map.clear();
        for(const raw of action.payload) {
          const { _id: id, date, ...props } = raw;
          const operation = Object.assign({ id, date: Date.parse(date) }, props);
          map.set(id, operation);
        }
      }),
    })
  },

  [actionTypes.REPORTING_RESET_OPERATIONS] : {
    next : (state) => ({
      ...state,
      operations: state.operations.clear(),
    })
  },

}, {
  operations : Immutable.Map()
});

'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.GET_OPERATIONS] : {
    next : (state, action) => ({ ...state, all: state.all.withMutations(map => {
      map.clear();
      for(const raw of action.payload) {
        const { _id: id, date, ...props } = raw;
        const operation = Object.assign({ id, date: Date.parse(date) }, props);
        map.set(id, operation);
      }
    })})
  },

  [actionTypes.MANAGEMENT_REFRESH] : {
    next : (state, action) => ({ ...state, visible: state.visible.withMutations(map => {
      map.clear();
      const groups = action.payload;
      for(const operation of state.all.values()) {
        if(groups.includes(operation.parent || null)) {
          map.set(operation.id, operation);
        }
      }
    })})
  }

}, {
  all: Immutable.Map(),
  visible: Immutable.Map()
});

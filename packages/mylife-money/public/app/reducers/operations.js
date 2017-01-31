'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.GET_OPERATIONS] : {
    next : (state, action) => state.withMutations((map => {
      map.clear();
      for(const raw of action.payload) {
        const { _id: id, date, ...props } = raw;
        const operation = Object.assign({ id, date: Date.parse(date) }, props);
        map.set(id, operation);
      }
    }))
  }

}, Immutable.Map());

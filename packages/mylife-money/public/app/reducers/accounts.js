'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.GET_ACCOUNTS] : {
    next : (state, action) => state.withMutations((map => {
      for(const account of action.payload) {
        map.set(account._id, {
          id      : account._id,
          code    : account.code,
          display : account.display
        });
      }
    }))
  }

}, Immutable.Map());

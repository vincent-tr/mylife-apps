'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { immutable } from 'mylife-tools-ui';

export default handleActions({

  [actionTypes.GET_ACCOUNTS] : {
    next : (state, action) => state.withMutations((map => {
      map.clear();
      for(const account of action.payload) {
        map.set(account._id, account);
      }
    }))
  }

}, new immutable.Map());

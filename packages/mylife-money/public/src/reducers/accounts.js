'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants/index';
import { immutable } from 'mylife-tools-ui';

export default handleActions({

  [actionTypes.GET_ACCOUNTS] : {
    next : (state, action) => state.withMutations((map => {
      map.clear();
      for(const raw of action.payload) {
        const { _id: id, ...props } = raw;
        const account = Object.assign({ id }, props);
        map.set(id, account);
      }
    }))
  }

}, new immutable.Map());

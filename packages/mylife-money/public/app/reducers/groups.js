'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.GET_GROUPS] : {
    next : (state, action) => state.withMutations((map => {
      map.clear();

      map.set(null, {
        id      : null,
        display : 'Non triés'
      });

      for(const raw of action.payload) {
        const { _id: id, ...props } = raw;
        const group = Object.assign({ id }, props);
        map.set(id, group);
      }
    }))
  }

}, Immutable.Map());

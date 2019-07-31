'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { immutable } from 'mylife-tools-ui';

const setGroup = {
  next : (state, action) => {
    const group = action.payload;
    return state.set(group._id, group);
  }
};

export default handleActions({

  [actionTypes.GET_GROUPS] : {
    next : (state, action) => state.withMutations(map => {
      map.clear();

      map.set(null, {
        _id     : null,
        display : 'Non triés'
      });

      for(const group of action.payload) {
        map.set(group._id, group);
      }
    })
  },

  [actionTypes.MANAGEMENT_CREATE_GROUP] : setGroup,
  [actionTypes.MANAGEMENT_UPDATE_GROUP] : setGroup,

  [actionTypes.MANAGEMENT_DELETE_GROUP] : {
    next : (state, action) => state.delete(action.payload)
  },

}, new immutable.Map());

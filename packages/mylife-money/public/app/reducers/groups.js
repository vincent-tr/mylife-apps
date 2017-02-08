'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

const setGroup = {
  next : (state, action) => {
    const { _id: id, ...props } = action.payload;
    const group = Object.assign({ id }, props);

    return state.set(group.id, group);
  }
};

export default handleActions({

  [actionTypes.GET_GROUPS] : {
    next : (state, action) => state.withMutations(map => {
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
    })
  },

  [actionTypes.CREATE_GROUP] : setGroup,
  [actionTypes.UPDATE_GROUP] : setGroup,

  [actionTypes.DELETE_GROUP] : {
    next : (state, action) => state.delete(action.payload)
  },

}, Immutable.Map());

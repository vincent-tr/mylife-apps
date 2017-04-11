'use strict';

import { handleActions } from 'redux-actions';
import Immutable from 'immutable';

export default (getConst, createConst, updateConst, deleteConst) => {

  const setItem = {
    next : (state, action) => {
      const { _id: id, ...props } = action.payload;
      const item = Object.assign({ id }, props);

      return state.set(item.id, item);
    }
  };

  return handleActions({

    [getConst] : {
      next : (state, action) => state.withMutations(map => {
        map.clear();

        map.set(null, {
          id      : null,
          display : 'Non triés'
        });

        for(const raw of action.payload) {
          const { _id: id, ...props } = raw;
          const item = Object.assign({ id }, props);
          map.set(id, item);
        }
      })
    },

    [createConst] : setItem,
    [updateConst] : setItem,

    [deleteConst] : {
      next : (state, action) => state.delete(action.payload)
    },

  }, Immutable.Map());

};


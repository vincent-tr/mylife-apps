'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({

  [actionTypes.GET_GROUPS] : {
    next : (state, action) => ({ ...state, list: state.list.withMutations((map => {
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
    }))})
  },

  [actionTypes.SELECT_GROUP] : {
    next : (state, action) => ({ ...state, selected : action.payload })
  }

}, { list: Immutable.Map(), selected: null });

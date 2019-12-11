'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

function prepareItem(raw) {
  const { _id: id, ...props } = raw;
  const item = Object.assign({ id }, props);
  return item;
}

function setupMap(map, payload) {
  map.clear();
  for(const raw of payload) {
    const item = prepareItem(raw);
    map.set(item.id, item);
  }
}

function setMap(map, payload) {
  const item = prepareItem(payload);
  if(payload.delete) {
    return map.delete(item.id);
  }
  return map.set(item.id, item);
}

const set = {
  next : (state, action) => ({
    ...state,
    stock   : setMap(state.stock, action.payload.stock),
    history : setMap(state.history, action.payload.history),
  })
};

export default handleActions({

  [actionTypes.GET_STOCK] : {
    next : (state, action) => ({
      ...state,
      stock   : state.stock.withMutations(map => setupMap(map, action.payload.stock)),
      history : state.history.withMutations(map => setupMap(map, action.payload.history)),
    })
  },

  [actionTypes.ADD_STOCK] : set,
  [actionTypes.REMOVE_STOCK] : set,

}, {
  stock: Immutable.Map(),
  history: Immutable.Map()
});

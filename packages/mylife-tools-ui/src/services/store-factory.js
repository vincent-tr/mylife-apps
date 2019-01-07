'use strict';

import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk                                             from 'redux-thunk';
import { createLogger }                                  from 'redux-logger';
import builtinReducers                                   from '../reducers';
import { STATE_PREFIX }                                  from '../constants/internal/defines';

let store;

export function initStore(reducers, ...middlewares) {
  store = createStore(
    combineReducers({
      [STATE_PREFIX] : builtinReducers,
      ...reducers
    }),
    applyMiddleware(...middlewares, thunk, createLogger())
  );
}

export function getStore() {
  return store;
}

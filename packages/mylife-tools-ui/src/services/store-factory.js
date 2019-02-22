'use strict';

import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import promise                                                    from './middlewares/promise';
import thunk                                                      from 'redux-thunk';
import { createLogger }                                           from 'redux-logger';
import builtinReducers                                            from '../reducers';
import { STATE_PREFIX }                                           from '../constants/defines';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store;

export function initStore(reducers, ...middlewares) {
  store = createStore(
    combineReducers({
      [STATE_PREFIX] : builtinReducers,
      ...reducers
    }),
    composeEnhancers(
      applyMiddleware(...middlewares, promise, thunk, createLogger())
    )
  );
}

export function getStore() {
  return store;
}

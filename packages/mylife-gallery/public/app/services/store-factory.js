'use strict';

import { applyMiddleware, createStore } from 'redux';
import thunk                            from 'redux-thunk';
import { createLogger }                 from 'redux-logger';

import reducer                          from '../reducers';
//import io                               from './io-middleware';

const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger())
);

export default store;
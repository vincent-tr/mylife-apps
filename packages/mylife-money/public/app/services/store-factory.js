'use strict';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import immutableStateInvariant from 'redux-immutable-state-invariant'; // FIXME: remove immutableStateInvariant in production

import dataService from './data-service';
import reducer from '../reducers/index';

const store = createStore(
  reducer,
  applyMiddleware(dataService, immutableStateInvariant(), thunk, createLogger())
);

export default store;

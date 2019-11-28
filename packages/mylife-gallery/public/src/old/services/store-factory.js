'use strict';

import { applyMiddleware, createStore }    from 'redux';
import thunk                               from 'redux-thunk';
import { createLogger }                    from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import reducer                             from '../reducers';
import fetch                               from './fetch-middleware';
import history                             from './history-factory';

const store = createStore(
  connectRouter(history)(reducer),
  applyMiddleware(fetch, thunk, routerMiddleware(history), createLogger())
);

export default store;
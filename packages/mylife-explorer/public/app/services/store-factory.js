'use strict';

import { applyMiddleware, createStore }    from 'redux';
import thunk                               from 'redux-thunk';
import { createLogger }                    from 'redux-logger';

import reducer                             from '../reducers';
//import fetch                               from './fetch-middleware';

const store = createStore(
  reducer,
  applyMiddleware(/*fetch,*/ thunk, createLogger())
);

export default store;
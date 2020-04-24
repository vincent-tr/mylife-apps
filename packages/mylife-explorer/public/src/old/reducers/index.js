'use strict';

import { combineReducers } from 'redux';

import errors   from './errors';
import busy     from './busy';
import metadata from './metadata';

export default combineReducers({
  errors,
  busy,
  metadata,
});

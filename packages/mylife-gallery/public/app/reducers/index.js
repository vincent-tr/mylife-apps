'use strict';

import { combineReducers } from 'redux';

import grid   from './grid';
import detail from './detail';

export default combineReducers({
  grid,
  detail,
});
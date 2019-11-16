'use strict';

import { combineReducers } from 'redux';

import albums from './albums';
import album  from './album';
import detail from './detail';

export default combineReducers({
  albums,
  album,
  detail,
});
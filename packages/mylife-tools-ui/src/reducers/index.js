'use strict';

import { combineReducers } from 'redux';

import dialogs from '../modules/dialogs/reducer';
import routing from '../modules/routing/reducer';

export default combineReducers({
  dialogs,
  routing
});

import { combineReducers } from 'redux';

import errors from './errors';
import info from './info';
import accounts from './accounts';
import groups from './groups';
import management from './management';

export default combineReducers({
  errors,
  info,
  accounts,
  groups,
  management
});

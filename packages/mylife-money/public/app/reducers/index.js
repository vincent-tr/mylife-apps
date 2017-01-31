import { combineReducers } from 'redux';

import errors from './errors';
import accounts from './accounts';
import groups from './groups';
import operations from './operations';

export default combineReducers({
  errors,
  accounts,
  groups,
  operations
});

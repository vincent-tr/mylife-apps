import { combineReducers } from 'redux';

import accounts from './accounts';
import groups from './groups';

export default combineReducers({
  accounts,
  groups
});

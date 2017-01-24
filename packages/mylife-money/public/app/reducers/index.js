import { combineReducers } from 'redux';

import management from './management';
import reporting from './reporting';

export default combineReducers({
  management,
  reporting
});

import { combineReducers } from 'redux';

import dialogs from '../modules/dialogs/store';
import routing from '../modules/routing/store';
import io from '../modules/io/store';
import views from '../modules/views/store';

export default combineReducers({
  dialogs,
  routing,
  io,
  views
});

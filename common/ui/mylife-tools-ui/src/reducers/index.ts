import { combineReducers } from 'redux';

import dialogs from '../modules/dialogs/store';
import routing from '../modules/routing/reducer';
import io from '../modules/io/reducer';
import views from '../modules/views/reducer';

export default combineReducers({
  dialogs,
  routing,
  io,
  views
});

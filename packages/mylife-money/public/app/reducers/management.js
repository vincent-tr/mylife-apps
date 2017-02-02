'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';

export default handleActions({

  [actionTypes.MANAGEMENT_SELECT_GROUP] : {
    next : (state, action) => ({ ...state, selectedGroup : action.payload })
  }

}, {
  selectedGroup : null
});

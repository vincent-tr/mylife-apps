'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({

  [actionTypes.SET_ACCOUNT_VIEW] : {
    next : (state, action) => action.payload
  }

}, null);

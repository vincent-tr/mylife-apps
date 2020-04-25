'use strict';

import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_DATA] : (state, action) => (action.payload),

}, null);

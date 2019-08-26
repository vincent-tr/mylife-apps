'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({

  [actionTypes.REPORTING_SET_VIEW] : (state, action) => ({
    ...state,
    view: action.payload
  }),

}, {
  view: null,
});

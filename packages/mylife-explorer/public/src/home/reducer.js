'use strict';

import { handleActions, io } from 'mylife-tools-ui';
//import actionTypes from './action-types';

export default handleActions({

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    //
  })

}, {
  //
});

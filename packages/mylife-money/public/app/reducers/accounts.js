'use strict';

import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default function(state = Immutable.Map(), action) {
  switch(action.type) {
    case actionTypes.GET_ACCOUNTS:
      console.log(action);
      return state;

    case actionTypes.GET_GROUPS:
      console.log(action);
      return state;

    default:
      return state;
  }
}

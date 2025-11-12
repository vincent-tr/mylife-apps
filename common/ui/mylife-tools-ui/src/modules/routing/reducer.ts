import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

const defaultState = {
  location : null,
};

export default handleActions({

  [actionTypes.LOCATION_CHANGE] : (state, action) => ({
    ...state,
    location: action.payload.location
  }),

}, defaultState);

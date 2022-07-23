import { handleActions, routing } from 'mylife-tools-ui';
import actionTypes from './action-types';

type FIXME_any = any;

export default handleActions({

  [actionTypes.SHOW_DETAIL] : (state, action: FIXME_any) => ({
    ...state,
    showDetail: action.payload
  }),

  [routing.actionTypes.LOCATION_CHANGE] : (state) => ({
    ...state,
    showDetail: true
  }),

}, {
  showDetail: true
});

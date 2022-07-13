import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

type FIXME_any = any;

export default handleActions({

  [actionTypes.SET_DATA] : (state, action: FIXME_any) => ({
    ...state,
    data: action.payload
  }),

  [actionTypes.SET_DETAIL] : (state, action: FIXME_any) => ({
    ...state,
    detail: action.payload
  }),


}, {
  data: null,
  detail: false
});

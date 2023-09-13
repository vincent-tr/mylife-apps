import { handleActions } from 'mylife-tools-ui';
import actionTypes from './action-types';

type FIXME_any = any;

const initialCriteria = {
  title: null,
  keywords: null,
};

const initialDisplay = {
  sortField: 'title',
  sortOrder: 'desc'
};

export default handleActions({

  [actionTypes.SET_DISPLAY] : (state, action: FIXME_any) => ({
    ...state,
    display: action.payload || initialDisplay
  }),

  [actionTypes.SET_CRITERIA] : (state, action: FIXME_any) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

}, {
  criteria: initialCriteria,
  display: initialDisplay
});

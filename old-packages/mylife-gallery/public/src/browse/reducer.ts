import { handleActions, immutable } from 'mylife-tools-ui';
import actionTypes from './action-types';

 type FIXME_any = any;

// empty set means all
const initialCriteria = {
  noDate: false,
  minDate: null,
  maxDate: null,
  minIntegrationDate: null,
  maxIntegrationDate: null,
  type: immutable.Set(),
  albums: immutable.Set(),
  noAlbum: false,
  persons: immutable.Set(),
  noPerson: false,
  keywords: null,
  caption: null,
  path: null,
  pathDuplicate: false,
  minWidth: null,
  maxWidth: null,
  minHeight: null,
  maxHeight: null,
};

const initialDisplay = {
  sortField: null,
  sortOrder: 'asc'
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

'use strict';

import { handleActions, io, immutable } from 'mylife-tools-ui';
import actionTypes from './action-types';

// empty set means all
const initialCriteria = {
  noDate: false,
  minDate: null,
  maxDate: null,
  minIntegrationDate: null,
  maxIntegrationDate: null,
  type: new immutable.Set(),
  albums: new immutable.Set(),
  noAlbum: false,
  persons: new immutable.Set(),
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

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [actionTypes.SET_DISPLAY] : (state, action) => ({
    ...state,
    display: action.payload || initialDisplay
  }),

  [actionTypes.SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: action.payload || initialCriteria
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null
  })

}, {
  viewId: null,
  criteria: initialCriteria,
  display: initialDisplay
});

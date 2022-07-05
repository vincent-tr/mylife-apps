'use strict';

import immutable         from 'immutable';
import { handleActions } from 'redux-actions';
import * as io           from '../io';
import actionTypes       from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => {
    const { viewId, uid } = action.payload;
    let { viewReferences } = state;
    viewReferences = viewId === null ? viewReferences.delete(uid) : viewReferences.set(uid, viewId);
    return { ...state, viewReferences };
  },

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewReferences: state.viewReferences.clear()
  }),

  [actionTypes.REF] : (state, action) => ({
    ...state,
    refCounts: addRef(state.refCounts, action.payload, 1)
  }),

  [actionTypes.UNREF] : (state, action) => ({
    ...state,
    refCounts: addRef(state.refCounts, action.payload, -1)
  }),

}, {
  viewReferences: new immutable.Map(),
  refCounts: new immutable.Map(),
});

function addRef(refCounts, uid, value) {
  const currentValue = refCounts.get(uid) || 0;
  const newValue = Math.max(currentValue + value, 0);
  return newValue ? refCounts.set(uid, newValue) : refCounts.delete(uid);
}
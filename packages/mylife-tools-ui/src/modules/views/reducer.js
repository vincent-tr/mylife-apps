'use strict';

import immutable         from 'immutable';
import { handleActions } from 'redux-actions';
import * as io           from '../io';
import actionTypes       from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW_REFERENCE] : (state, action) => {
    const { viewId, uid } = action.payload;
    let { viewReferences } = state;
    viewReferences = viewId === null ? viewReferences.delete(uid) : viewReferences.set(uid, viewId);
    return { ...state, viewReferences };
  },

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewReferences: state.viewReferences.clear()
  })

}, {
  viewReferences: new immutable.Map(),
});

'use strict';

import Immutable         from 'immutable';
import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

const defaultState = {
  online : false,
  views: new Immutable.Map()
};

export default handleActions({

  [actionTypes.SET_ONLINE] : (state, action) => ({
    ...state,
    online: action.payload,
    views: state.views.clear()
  }),

  [actionTypes.VIEW_SET] : (state, action) => {
    const { viewId, object } = action.payload;
    return {
      ...state,
      views: viewOperation(state.views, viewId, view => view.set(object._id, object))
    };
  },

  [actionTypes.VIEW_UNSET] : (state, action) => {
    const { viewId, objectId } = action.payload;
    return {
      ...state,
      views: viewOperation(state.views, viewId, view => view.delete(objectId))
    };
  },

  [actionTypes.VIEW_CLOSE] : (state, action) => ({
    ...state,
    views: state.views.delete(action.payload.viewId)
  }),

}, defaultState);

function viewOperation(views, viewId, operation) {
  if(!views.has(viewId)) {
    views = views.set(viewId, new Immutable.Map());
  }
  return views.update(viewId, operation);
}

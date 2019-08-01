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

  [actionTypes.VIEW_CHANGE] : (state, action) => {
    const { viewId, list } = action.payload;
    return {
      ...state,
      views: viewMutations(state.views, viewId, mutable => {
        for(const item of list) {
          switch(item.type) {
            case 'set': {
              const { object } = item;
              mutable.set(object._id, object);
              break;
            }

            case 'unset':
              mutable.delete(item.objectId);
              break;

            default:
              console.log(`Message with unknown notification type '${item.type}', ignored`);
              break;
          }
        }
      })
    };
  },

  [actionTypes.VIEW_CLOSE] : (state, action) => ({
    ...state,
    views: state.views.delete(action.payload.viewId)
  }),

}, defaultState);

function viewMutations(views, viewId, mutator) {
  if(!views.has(viewId)) {
    views = views.set(viewId, new Immutable.Map());
  }
  return views.update(viewId, view => view.withMutations(mutator));
}

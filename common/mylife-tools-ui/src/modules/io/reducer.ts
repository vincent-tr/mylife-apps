import immutable         from 'immutable';
import { handleActions } from 'redux-actions';
import actionTypes       from './action-types';

type FIXME_any = any;

const defaultState = {
  online : false,
  views: immutable.Map()
};

export default handleActions({

  [actionTypes.SET_ONLINE] : (state, action: FIXME_any) => ({
    ...state,
    online: action.payload,
    views: state.views.clear()
  }),

  [actionTypes.VIEW_CHANGE] : (state, action: FIXME_any) => {
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

  [actionTypes.VIEW_CLOSE] : (state, action: FIXME_any) => ({
    ...state,
    views: state.views.delete(action.payload.viewId)
  }),

}, defaultState);

function viewMutations(views, viewId, mutator) {
  if(!views.has(viewId)) {
    views = views.set(viewId, immutable.Map());
  }
  return views.update(viewId, view => view.withMutations(mutator));
}

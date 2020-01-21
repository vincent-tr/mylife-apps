'use strict';

import { io, handleActions, immutable } from 'mylife-tools-ui';
import actionTypes from './action-types';

export default handleActions({

  [actionTypes.SET_VIEW] : (state, action) => ({
    ...state,
    viewId: action.payload
  }),

  [actionTypes.REF] : (state, action) => ({
    ...state,
    refs: ref(state.refs, action.payload)
  }),

  [actionTypes.UNREF] : (state, action) => ({
    ...state,
    refs: unref(state.refs, action.payload)
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    viewId: null,
    refs: state.refs.clear()
  })

}, {
  viewId: null,
  refs: new immutable.Map()
});

function ref(refs, id) {
  const count = refs.get(id) || 0;
  return refs.set(id, count + 1);
}

function unref(refs, id) {
  const count = refs.get(id);
  if(count <= 1) {
    return refs.delete(id);
  }
  return refs.set(id, count - 1);
}

'use strict';

import { handleActions, io, immutable } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export default handleActions({
  [actionTypes.MANAGEMENT_SET_CRITERIA] : (state, action) => ({
    ...state,
    criteria: {
      ...state.criteria,
      ...action.payload
    },
    operations: {
      ...state.operations,
      // clear selection when criteria changes
      selected: state.operations.selected.clear()
    }
  }),

  [actionTypes.MANAGEMENT_SET_OPERATION_VIEW] : (state, action) => ({
    ...state,
    operations: {
      ...state.operations,
      view: action.payload,
      selected: state.operations.selected.clear()
    }
  }),

  [actionTypes.MANAGEMENT_SELECT_OPERATIONS] : (state, action) => ({
    ...state, operations: {
      ...state.operations,
      selected: applySelection(state.operations.selected, action.payload)
    }
  }),

  [actionTypes.MANAGEMENT_SET_DETAIL] : (state, action) => ({
    ...state,
    operations: {
      ...state.operations,
      detail: action.payload
    }
  }),

  [io.actionTypes.SET_ONLINE] : (state) => ({
    ...state,
    operations: {
      ...state.operations,
      view: null,
      selected: state.operations.selected.clear(),
      detail: null
    }
  })

}, {
  criteria: {
    minDate: new Date(new Date().getFullYear(), 0, 1),
    maxDate: null,
    account: null,
    group: null,
  },
  operations : {
    view     : null,
    selected : new immutable.Set(),
    detail   : null
  }
});

function applySelection(set, { selected, id, ids }) {
  if(!id) {
    return set.clear().union(ids);
  }

  if(selected) {
    return set.add(id);
  }
  return set.remove(id);
}

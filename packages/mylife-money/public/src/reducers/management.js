'use strict';

import { handleActions } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { immutable } from 'mylife-tools-ui';

export default handleActions({
  [actionTypes.MANAGEMENT_SET_CRITERIA] : {
    next : (state, action) => ({
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
    })
  },

  [actionTypes.MANAGEMENT_SET_OPERATION_VIEW] : {
    next : (state, action) => ({
      ...state,
      operations: {
        ...state.operations,
        view: action.payload,
        selected: state.operations.selected.clear()
      }
    })
  },

  [actionTypes.MANAGEMENT_SELECT_OPERATIONS] : {
    next : (state, action) => ({
      ...state, operations: {
        ...state.operations,
        selected: applySelection(state.operations.selected, action.payload)
      }
    })
  },

}, {
  criteria: {
    minDate: new Date(new Date().getFullYear(), 0, 1),
    maxDate: null,
    account: null,
    group: null,
  },
  operations : {
    view     : null,
    selected : new immutable.Set()
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

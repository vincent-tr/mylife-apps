'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

export default handleActions({
  [actionTypes.MANAGEMENT_SET_MIN_DATE] : {
    next : (state, action) => ({ ...state, minDate: action.payload })
  },

  [actionTypes.MANAGEMENT_SET_MAX_DATE] : {
    next : (state, action) => ({ ...state, maxDate: action.payload })
  },

  [actionTypes.MANAGEMENT_SET_ACCOUNT] : {
    next : (state, action) => ({ ...state, account: action.payload })
  },

  [actionTypes.MANAGEMENT_SELECT_GROUP] : {
    next : (state, action) => ({ ...state, selectedGroup : action.payload })
  },

  [actionTypes.MANAGEMENT_GET_OPERATIONS] : {
    next : (state, action) => ({ ...state, operations: {
      ...state.operations,
      all: state.operations.all.withMutations(map => {
        map.clear();
        for(const raw of action.payload) {
          const { _id: id, date, ...props } = raw;
          const operation = Object.assign({ id, date: Date.parse(date) }, props);
          map.set(id, operation);
        }
      })
    }})
  },

  [actionTypes.MANAGEMENT_REFRESH] : {
    next : (state, action) => ({ ...state, operations: {
      ...state.operations,
      visible: state.operations.visible.withMutations(set => {
        set.clear();
        const groups = action.payload;
        for(const operation of state.operations.all.values()) {
          if(groups.includes(operation.group || null)) {
            set.add(operation.id);
          }
        }
      }),
      selected: state.operations.selected.clear()
    }})
  },

  [actionTypes.MANAGEMENT_SELECT_OPERATIONS] : {
    next : (state, action) => ({ ...state, operations: {
      ...state.operations,
      selected:
        action.payload.all ?
          (action.payload.selected ?
            state.operations.selected.union(state.operations.visible) :
            state.operations.selected.clear()) :
          state.operations.selected.clear().union(action.payload.operations)
    }})
  },

  [actionTypes.MANAGEMENT_MOVE_OPERATIONS] : {
    next : (state, action) => ({ ...state, operations: {
      ...state.operations,
      all: state.operations.all.withMutations(map => {
        for(const id of action.payload.operations) {
          const op = map.get(id);
          map.set(id, {
            ...op,
            group: action.payload.group
          });
        }
      })
    }})
  },

  [actionTypes.MANAGEMENT_OPERATIONS_SET_NOTE] : {
    next : (state, action) => ({ ...state, operations: {
      ...state.operations,
      all: state.operations.all.withMutations(map => {
        for(const id of action.payload.operations) {
          const op = map.get(id);
          map.set(id, {
            ...op,
            note: action.payload.note
          });
        }
      })
    }})
  }

}, {
  minDate       : new Date(new Date().getFullYear(), 0, 1),
  maxDate       : null,
  account       : null,
  selectedGroup : null,
  operations    : {
    all      : Immutable.Map(),
    visible  : Immutable.Set(),
    selected : Immutable.Set()
  }
});

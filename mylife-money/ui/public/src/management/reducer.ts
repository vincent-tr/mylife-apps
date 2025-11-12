import immutable from 'immutable';
import { handleActions } from 'redux-actions';
import { io } from 'mylife-tools-ui';
import actionTypes from './action-types';

type FIXME_any = any;

export default handleActions({
  [actionTypes.SET_CRITERIA] : (state, action: FIXME_any) => ({
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

  [actionTypes.SET_OPERATION_VIEW] : (state, action: FIXME_any) => ({
    ...state,
    operations: {
      ...state.operations,
      view: action.payload,
      selected: state.operations.selected.clear()
    }
  }),

  [actionTypes.SELECT_OPERATIONS] : (state, action: FIXME_any) => ({
    ...state,
    operations: {
      ...state.operations,
      selected: applySelection(state.operations.selected, action.payload)
    }
  }),

  [actionTypes.SET_DETAIL] : (state, action: FIXME_any) => ({
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
    selected : immutable.Set(),
    detail   : null
  }
});

function applySelection(set, { selected, id, ids }) {
  if(!id) {
    return set.clear().union(ids);
  }

  if(selected) {
    return set.add(id);
  } else {
    return set.remove(id);
  }
}

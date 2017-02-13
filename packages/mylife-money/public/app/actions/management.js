'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getGroupAndChildrenIds } from '../selectors/groups';
import { getSelectedGroupId, getSelectedOperations } from '../selectors/management';

const querySelectGroup   = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);
const queryCreateGroup   = createAction(actionTypes.MANAGEMENT_QUERY_CREATE_GROUP);
const queryDeleteGroup   = createAction(actionTypes.MANAGEMENT_QUERY_DELETE_GROUP);

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(querySelectGroup(id));
    dispatch(refresh());
  };
};

export const createGroup = () => {
  return (dispatch, getState) => {
    const parentGroup = getSelectedGroupId(getState());
    const newGroup = {
      display: `group${++groupIdCount}`,
      parent: parentGroup
    };
    dispatch(queryCreateGroup(newGroup));
  };
};

export const deleteGroup = () => {
  return (dispatch, getState) => {
    const id = getSelectedGroupId(getState());
    dispatch(queryDeleteGroup(id));
  };
};

export const updateGroup = createAction(actionTypes.MANAGEMENT_QUERY_UPDATE_GROUP);

const queryOperations = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS);
const queryMoveOperations = createAction(actionTypes.MANAGEMENT_QUERY_MOVE_OPERATIONS);

export const getOperations = () => {
  return (dispatch, getState) => {
    const management = getState().management;
    dispatch(queryOperations({
      minDate : management.minDate,
      maxDate : management.maxDate,
      account : management.account
    }));
  };
};

export const moveOperations = (group) => {
  return (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op.id);
    dispatch(queryMoveOperations({ group, operations }));
  };
};

const queryRefresh    = createAction(actionTypes.MANAGEMENT_REFRESH);
const querySetMinDate = createAction(actionTypes.MANAGEMENT_SET_MIN_DATE);
const querySetMaxDate = createAction(actionTypes.MANAGEMENT_SET_MAX_DATE);
const querySetAccount = createAction(actionTypes.MANAGEMENT_SET_ACCOUNT);

export const setMinDate = (value) => {
  return (dispatch) => {
    dispatch(querySetMinDate(value));
    dispatch(getOperations());
  };
};

export const setMaxDate = (value) => {
  return (dispatch) => {
    dispatch(querySetMaxDate(value));
    dispatch(getOperations());
  };
};

export const setAccount = (value) => {
  return (dispatch) => {
    dispatch(querySetAccount(value));
    dispatch(getOperations());
  };
};

export const refresh = () => {
  return (dispatch, getState) => {
    const state  = getState();
    const groups = getGroupAndChildrenIds(state, { group: getSelectedGroupId(state) });
    dispatch(queryRefresh(groups));
  };
};

export const selectOperation = createAction(actionTypes.MANAGEMENT_SELECT_OPERATIONS);

const queryImportOperations = createAction(actionTypes.MANAGEMENT_QUERY_IMPORT_OPERATIONS);

export const importOperations = (account, file) => {
  return (dispatch) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return dispatch(queryImportOperations(err)); }
      const content = reader.result;
      dispatch(queryImportOperations({ account, content }));
    };

    reader.readAsText(file);
  };
};

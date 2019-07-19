'use strict';

let groupIdCount = 0;

import { createAction, io } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getGroupAndChildrenIds } from '../selectors/groups';
import { getSelectedGroupId, getSelectedOperations } from '../selectors/management';

const querySelectGroup = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);

export const createGroupData = createAction(actionTypes.MANAGEMENT_CREATE_GROUP);
export const updateGroupData = createAction(actionTypes.MANAGEMENT_UPDATE_GROUP);
export const deleteGroupData = createAction(actionTypes.MANAGEMENT_DELETE_GROUP);

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(querySelectGroup(id));
    dispatch(refresh());
  };
};

export const createGroup = () => {
  return async (dispatch, getState) => {
    const parentGroup = getSelectedGroupId(getState());
    const newGroup = {
      display: `group${++groupIdCount}`,
      parent: parentGroup
    };

    const data = await dispatch(io.call({
      service: 'management',
      method: 'createGroup',
      object: newGroup
    }));

    dispatch(createGroupData(data));
  };
};

export const deleteGroup = () => {
  return async (dispatch, getState) => {
    const id = getSelectedGroupId(getState());

    await dispatch(io.call({
      service: 'management',
      method: 'deleteGroup',
      id
    }));

    dispatch(deleteGroupData(id));
  };
};

export const updateGroup = (group) => {
  return async (dispatch) => {
    const data = await dispatch(io.call({
      service: 'management',
      method: 'updateGroup',
      object: group
    }));

    dispatch(updateGroupData(data));
  };
};

const queryOperations = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS);
const queryMoveOperations = createAction(actionTypes.MANAGEMENT_QUERY_MOVE_OPERATIONS);
const queryOperationsSetNote = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS_SET_NOTE);

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

export const operationsSetNote = (note) => {
  return (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op.id);
    dispatch(queryOperationsSetNote({ note, operations }));
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

export const operationsExecuteRules = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS_EXECUTE_RULES);

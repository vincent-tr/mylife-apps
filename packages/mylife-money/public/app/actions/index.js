'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getGroup } from '../selectors/groups';
import { getSelectedGroupId } from '../selectors/management';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);

export const getGroups   = createAction(actionTypes.QUERY_GROUPS);

const querySelectGroup   = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);
const queryCreateGroup   = createAction(actionTypes.QUERY_CREATE_GROUP);
const queryDeleteGroup   = createAction(actionTypes.QUERY_DELETE_GROUP);

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(querySelectGroup(id));
    dispatch(managementRefresh());
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

export const updateGroup = createAction(actionTypes.QUERY_UPDATE_GROUP);

const queryOperations = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS);

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

export const clearError = createAction(actionTypes.CLEAR_ERROR);

const queryManagementRefresh    = createAction(actionTypes.MANAGEMENT_REFRESH);
const queryManagementSetMinDate = createAction(actionTypes.MANAGEMENT_SET_MIN_DATE);
const queryManagementSetMaxDate = createAction(actionTypes.MANAGEMENT_SET_MAX_DATE);
const queryManagementSetAccount = createAction(actionTypes.MANAGEMENT_SET_ACCOUNT);

export const managementSetMinDate = (value) => {
  return (dispatch) => {
    dispatch(queryManagementSetMinDate(value));
    dispatch(getOperations());
  };
};

export const managementSetMaxDate = (value) => {
  return (dispatch) => {
    dispatch(queryManagementSetMaxDate(value));
    dispatch(getOperations());
  };
};

export const managementSetAccount = (value) => {
  return (dispatch) => {
    dispatch(queryManagementSetAccount(value));
    dispatch(getOperations());
  };
};

export const managementRefresh = () => {
  return (dispatch, getState) => {
    const state = getState();

    let currentGroupId = getSelectedGroupId(state);
    const groups = [];
    if(!currentGroupId) {
      groups.push(null); // unset
    }
    while(currentGroupId) {
      groups.push(currentGroupId);
      const group = getGroup(state, { group: currentGroupId });
      currentGroupId = group.parent;
    }

    dispatch(queryManagementRefresh(groups));
  };
};

'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const queryAccounts         = createAction(actionTypes.QUERY_ACCOUNTS);
export const getAccounts           = createAction(actionTypes.GET_ACCOUNTS);

export const queryGroups           = createAction(actionTypes.QUERY_GROUPS);
export const getGroups             = createAction(actionTypes.GET_GROUPS);
export const managementSelectGroup = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);

const queryCreateGroup = createAction(actionTypes.QUERY_CREATE_GROUP);

export const createGroup = () => {
  return (dispatch, getState) => {
    const parentGroup = getState().management.selectedGroup;
    const newGroup = {
      display: `group${++groupIdCount}`,
      parent: parentGroup
    };
    dispatch(queryCreateGroup(newGroup));
  };
};

export const deleteGroup     = createAction(actionTypes.QUERY_DELETE_GROUP);

export const queryOperations = createAction(actionTypes.QUERY_OPERATIONS);
export const getOperations   = createAction(actionTypes.GET_OPERATIONS);
'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);

export const getGroups   = createAction(actionTypes.QUERY_GROUPS);
export const selectGroup = createAction(actionTypes.SELECT_GROUP);

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

export const deleteGroup   = createAction(actionTypes.QUERY_DELETE_GROUP);

export const getOperations = createAction(actionTypes.QUERY_OPERATIONS);

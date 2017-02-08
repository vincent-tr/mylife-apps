'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getGroup } from '../selectors/groups';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);
export const getGroups   = createAction(actionTypes.QUERY_GROUPS);

const queryCreateGroup   = createAction(actionTypes.QUERY_CREATE_GROUP);
const queryDeleteGroup   = createAction(actionTypes.QUERY_DELETE_GROUP);

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

export const clearError = createAction(actionTypes.CLEAR_ERROR);

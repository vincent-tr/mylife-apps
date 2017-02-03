'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getSelectedGroupId } from '../selectors/groups';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);

export const getGroups   = createAction(actionTypes.QUERY_GROUPS);
export const selectGroup = createAction(actionTypes.SELECT_GROUP);

const queryCreateGroup = createAction(actionTypes.QUERY_CREATE_GROUP);
const queryDeleteGroup = createAction(actionTypes.QUERY_DELETE_GROUP);

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

export const getOperations = createAction(actionTypes.QUERY_OPERATIONS);

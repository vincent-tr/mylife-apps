'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { refresh } from './management';

export const getAccounts   = createAction(actionTypes.GET_ACCOUNTS);

export const getGroups     = createAction(actionTypes.GET_GROUPS);
export const createGroup   = createAction(actionTypes.MANAGEMENT_CREATE_GROUP);
export const updateGroup   = createAction(actionTypes.MANAGEMENT_UPDATE_GROUP);
export const deleteGroup   = createAction(actionTypes.MANAGEMENT_DELETE_GROUP);

const internalManagementGetOperations = createAction(actionTypes.MANAGEMENT_GET_OPERATIONS);

export const managementGetOperations = (value) => {
  return (dispatch) => {
    dispatch(internalManagementGetOperations(value));
    dispatch(refresh());
  };
};
'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { refresh, getOperations } from './management';
import { showInfo } from './common';

export const getAccounts   = createAction(actionTypes.GET_ACCOUNTS);

export const getGroups     = createAction(actionTypes.GET_GROUPS);
export const createGroup   = createAction(actionTypes.MANAGEMENT_CREATE_GROUP);
export const updateGroup   = createAction(actionTypes.MANAGEMENT_UPDATE_GROUP);
export const deleteGroup   = createAction(actionTypes.MANAGEMENT_DELETE_GROUP);

const internalManagementGetOperations = createAction(actionTypes.MANAGEMENT_GET_OPERATIONS);
const internalManagementMoveOperations = createAction(actionTypes.MANAGEMENT_MOVE_OPERATIONS);
const internalManagementOperationsSetNote = createAction(actionTypes.MANAGEMENT_OPERATIONS_SET_NOTE);

export const managementGetOperations = (value) => {
  return (dispatch) => {
    dispatch(internalManagementGetOperations(value));
    dispatch(refresh());
  };
};

export const managementMoveOperations = (value) => {
  return (dispatch) => {
    dispatch(internalManagementMoveOperations(value));
    dispatch(refresh());
  };
};

export const managementOperationsSetNote = (value) => {
  return (dispatch) => {
    dispatch(internalManagementOperationsSetNote(value));
    dispatch(refresh());
  };
};

export const managementImportOperations = (count) => {
  return (dispatch) => {
    dispatch(getOperations());
    dispatch(showInfo(`${count} operation(s) importée(s)`));
  };
};

export const managementOperationsExecuteRules = (count) => {
  return (dispatch) => {
    dispatch(getOperations());
    dispatch(showInfo(`${count} operation(s) déplacée(s)`));
  };
};
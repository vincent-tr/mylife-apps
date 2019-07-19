'use strict';

import { createAction, dialogs } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { refresh, getOperations } from './management';

const showSuccess = message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success });

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
    dispatch(showSuccess(`${count} operation(s) importée(s)`));
  };
};

export const managementOperationsExecuteRules = (count) => {
  return (dispatch) => {
    dispatch(getOperations());
    dispatch(showSuccess(`${count} operation(s) déplacée(s)`));
  };
};

export const reportingGetOperations = createAction(actionTypes.REPORTING_GET_OPERATIONS);

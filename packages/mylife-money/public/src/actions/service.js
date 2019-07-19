'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { refresh } from './management';

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

export const reportingGetOperations = createAction(actionTypes.REPORTING_GET_OPERATIONS);

'use strict';

import { actionTypes } from '../constants';
import {
  managementGetOperations, managementMoveOperations, managementOperationsSetNote, managementImportOperations, managementOperationsExecuteRules,
  reportingGetOperations
} from '../actions/service';

import { io } from 'mylife-tools-ui';

const dataService = (/*store*/) => next => action => {
  switch (action.type) {
    case actionTypes.MANAGEMENT_QUERY_OPERATIONS: {
      const query = {};
      if(action.payload.minDate) {
        query.minDate = action.payload.minDate.valueOf();
      }
      if(action.payload.maxDate) {
        query.maxDate = action.payload.maxDate.valueOf();
      }
      if(action.payload.account) {
        query.account = action.payload.account;
      }
      next(io.call({
        service: 'management',
        method: 'getOperations',
        ... query
      })).then(data => next(managementGetOperations(data)), err => next(managementGetOperations(err)));
      break;
    }

    case actionTypes.MANAGEMENT_QUERY_MOVE_OPERATIONS:
      next(io.call({
        service: 'management',
        method: 'moveOperations',
        ... action.payload
      })).then(() => next(managementMoveOperations(action.payload)), err => next(managementMoveOperations(err)));
      break;

    case actionTypes.MANAGEMENT_QUERY_OPERATIONS_SET_NOTE:
      next(io.call({
        service: 'management',
        method: 'operationsSetNote',
        ... action.payload
      })).then(() => next(managementOperationsSetNote(action.payload)), err => next(managementOperationsSetNote(err)));
      break;

    case actionTypes.MANAGEMENT_QUERY_IMPORT_OPERATIONS:
      next(io.call({
        service: 'management',
        method: 'operationsImport',
        ... action.payload
      })).then(count => next(managementImportOperations(count)), err => next(managementImportOperations(err)));
      break;

    case actionTypes.MANAGEMENT_QUERY_OPERATIONS_EXECUTE_RULES:
      next(io.call({
        service: 'management',
        method: 'operationsExecuteRules'
      })).then(count => next(managementOperationsExecuteRules(count)), err => next(managementOperationsExecuteRules(err)));
      break;

    case actionTypes.REPORTING_QUERY_OPERATIONS: {
      const query = {};
      if(action.payload.minDate) {
        query.minDate = action.payload.minDate.valueOf();
      }
      if(action.payload.maxDate) {
        query.maxDate = action.payload.maxDate.valueOf();
      }
      if(action.payload.account) {
        query.account = action.payload.account;
      }
      next(io.call({
        service: 'management',
        method: 'getOperations',
        ... query
      })).then(data => next(reportingGetOperations(data)), err => next(reportingGetOperations(err)));
      break;
    }
  }

  return next(action);
};

export default dataService;

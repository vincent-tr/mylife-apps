'use strict';

import { actionTypes } from '../constants';
import {
  reportingGetOperations
} from '../actions/service';

import { io } from 'mylife-tools-ui';

const dataService = (/*store*/) => next => action => {
  switch (action.type) {
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

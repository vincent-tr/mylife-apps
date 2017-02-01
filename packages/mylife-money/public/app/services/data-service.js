'use strict';

import request from 'superagent';
import { actionTypes } from '../constants/index';
import { getAccounts, getGroups, getOperations } from '../actions/index';

const dataService = (/*store*/) => next => action => {
  next(action);

  switch (action.type) {
    case actionTypes.QUERY_ACCOUNTS:
      request
        .get('/api/accounts')
        .end((err, res) => {
          if (err) {
            return next(getAccounts(err));
          }
          const data = JSON.parse(res.text);
          return next(getAccounts(data));
        });
      break;

    case actionTypes.QUERY_GROUPS:
      request
        .get('/api/groups')
        .end((err, res) => {
          if (err) {
            return next(getGroups(err));
          }
          const data = JSON.parse(res.text);
          return next(getGroups(data));
        });
      break;

    case actionTypes.QUERY_CREATE_GROUP:
      request
        .put('/api/group')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(getOperations(err));
          }
          const data = JSON.parse(res.text);
          return next(getOperations(data));
        });
      break;

    case actionTypes.QUERY_OPERATIONS:
      request
        .get('/api/operations') // TODO: parameters
        .end((err, res) => {
          if (err) {
            return next(getOperations(err));
          }
          const data = JSON.parse(res.text);
          return next(getOperations(data));
        });
      break;
  }
};

export default dataService;
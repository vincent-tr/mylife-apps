'use strict';

import request from 'superagent';
import { actionTypes } from '../constants/index';
import {
  getAccounts,
  getGroups, createGroup, updateGroup, deleteGroup,
  managementGetOperations, managementMoveOperations
} from '../actions/service';

const dataService = (/*store*/) => next => action => {
  next(action);

  switch (action.type) {
    case actionTypes.QUERY_ACCOUNTS:
      request
        .get('/api/accounts')
        .end((err, res) => {
          if (err) {
            return next(getAccounts(new Error(JSON.parse(res.text))));
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
            return next(getGroups(new Error(JSON.parse(res.text))));
          }
          const data = JSON.parse(res.text);
          return next(getGroups(data));
        });
      break;

    case actionTypes.MANAGEMENT_QUERY_CREATE_GROUP:
      request
        .put('/api/group')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(createGroup(new Error(JSON.parse(res.text))));
          }
          const data = JSON.parse(res.text);
          return next(createGroup(data));
        });
      break;

    case actionTypes.MANAGEMENT_QUERY_UPDATE_GROUP:
      request
        .post('/api/group')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(updateGroup(new Error(JSON.parse(res.text))));
          }
          const data = JSON.parse(res.text);
          return next(updateGroup(data));
        });
      break;

    case actionTypes.MANAGEMENT_QUERY_DELETE_GROUP:
      request
        .delete('/api/group')
        .send({ id: action.payload })
        .end((err, res) => {
          if (err) {
            return next(deleteGroup(new Error(JSON.parse(res.text))));
          }
          return next(deleteGroup(action.payload));
        });
      break;

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
      request
        .get('/api/operations')
        .query(query)
        .end((err, res) => {
          if (err) {
            return next(managementGetOperations(new Error(JSON.parse(res.text))));
          }
          const data = JSON.parse(res.text);
          return next(managementGetOperations(data));
        });
      break;
    }

    case actionTypes.MANAGEMENT_QUERY_MOVE_OPERATIONS: {
      request
        .post('/api/operations_move')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(managementMoveOperations(new Error(JSON.parse(res.text))));
          }
          return next(managementMoveOperations(action.payload));
        });
      break;
    }
  }
};

export default dataService;
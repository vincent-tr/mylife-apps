'use strict';

import request from 'superagent';
import { actionTypes } from '../constants/index';
import {
  getAccounts,
  getGroups, createGroup, updateGroup, deleteGroup,
  getOperations } from '../actions/service-actions';

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
            return next(createGroup(err));
          }
          const data = JSON.parse(res.text);
          return next(createGroup(data));
        });
      break;

    case actionTypes.QUERY_UPDATE_GROUP:
      request
        .put('/api/group')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(updateGroup(err));
          }
          const data = JSON.parse(res.text);
          return next(updateGroup(data));
        });
      break;

    case actionTypes.QUERY_DELETE_GROUP:
      request
        .put('/api/group')
        .send(action.payload)
        .end((err, res) => {
          if (err) {
            return next(deleteGroup(err));
          }
          const data = JSON.parse(res.text);
          return next(deleteGroup(data));
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
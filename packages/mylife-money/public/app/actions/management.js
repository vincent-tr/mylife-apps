'use strict';

let groupIdCount = 0;

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getGroup } from '../selectors/groups';
import { getSelectedGroupId } from '../selectors/management';

const querySelectGroup   = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(querySelectGroup(id));
    dispatch(refresh());
  };
};

const queryOperations = createAction(actionTypes.MANAGEMENT_QUERY_OPERATIONS);

export const getOperations = () => {
  return (dispatch, getState) => {
    const management = getState().management;
    dispatch(queryOperations({
      minDate : management.minDate,
      maxDate : management.maxDate,
      account : management.account
    }));
  };
};

const queryRefresh    = createAction(actionTypes.MANAGEMENT_REFRESH);
const querySetMinDate = createAction(actionTypes.MANAGEMENT_SET_MIN_DATE);
const querySetMaxDate = createAction(actionTypes.MANAGEMENT_SET_MAX_DATE);
const querySetAccount = createAction(actionTypes.MANAGEMENT_SET_ACCOUNT);

export const setMinDate = (value) => {
  return (dispatch) => {
    dispatch(querySetMinDate(value));
    dispatch(getOperations());
  };
};

export const setMaxDate = (value) => {
  return (dispatch) => {
    dispatch(querySetMaxDate(value));
    dispatch(getOperations());
  };
};

export const setAccount = (value) => {
  return (dispatch) => {
    dispatch(querySetAccount(value));
    dispatch(getOperations());
  };
};

export const refresh = () => {
  return (dispatch, getState) => {
    const state = getState();

    let currentGroupId = getSelectedGroupId(state);
    const groups = [];
    if(!currentGroupId) {
      groups.push(null); // unset
    }
    while(currentGroupId) {
      groups.push(currentGroupId);
      const group = getGroup(state, { group: currentGroupId });
      currentGroupId = group.parent;
    }

    dispatch(queryRefresh(groups));
  };
};

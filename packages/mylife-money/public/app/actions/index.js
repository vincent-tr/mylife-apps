'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const queryAccounts   = createAction(actionTypes.QUERY_ACCOUNTS);
export const getAccounts     = createAction(actionTypes.GET_ACCOUNTS);
export const queryGroups     = createAction(actionTypes.QUERY_GROUPS);
export const getGroups       = createAction(actionTypes.GET_GROUPS);
export const queryOperations = createAction(actionTypes.QUERY_OPERATIONS);
export const getOperations   = createAction(actionTypes.GET_OPERATIONS);
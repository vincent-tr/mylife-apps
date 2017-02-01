'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getAccounts   = createAction(actionTypes.GET_ACCOUNTS);

export const getGroups     = createAction(actionTypes.GET_GROUPS);
export const createGroup   = createAction(actionTypes.CREATE_GROUP);
export const updateGroup   = createAction(actionTypes.UPDATE_GROUP);
export const deleteGroup   = createAction(actionTypes.DELETE_GROUP);

export const getOperations = createAction(actionTypes.GET_OPERATIONS);
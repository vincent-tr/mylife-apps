'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);
export const getGroups   = createAction(actionTypes.QUERY_GROUPS);

export const clearError = createAction(actionTypes.CLEAR_ERROR);
export const clearInfo = createAction(actionTypes.CLEAR_INFO);
export const showInfo = createAction(actionTypes.SHOW_INFO);

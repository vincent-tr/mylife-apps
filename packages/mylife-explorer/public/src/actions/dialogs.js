'use strict';

import { createAction } from 'redux-actions';
import actionTypes      from '../constants/action-types';

export const clearError = createAction(actionTypes.ERROR_CLEAR);
export const setBusy    = createAction(actionTypes.BUSY_SET);
export const clearBusy  = createAction(actionTypes.BUSY_CLEAR);

'use strict';

import { createAction } from 'redux-actions';
import actionTypes      from '../constants/action-types';

export const clearError = createAction(actionTypes.ERROR_CLEAR);

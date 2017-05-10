'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const addStock    = createAction(actionTypes.QUERY_ADD_STOCK);
export const removeStock = createAction(actionTypes.QUERY_REMOVE_STOCK);
export const getStock    = createAction(actionTypes.QUERY_GET_STOCK);
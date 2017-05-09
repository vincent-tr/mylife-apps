'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const stockAdd = createAction(actionTypes.QUERY_STOCK_ADD);
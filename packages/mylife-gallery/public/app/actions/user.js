'use strict';

import { createAction } from 'redux-actions';
import actionTypes from '../constants/action-types';

export const init = createAction(actionTypes.FETCH_GRID);
export const showDetail = createAction(actionTypes.SET_DETAIL);
export const hideDetail = () => showDetail(null);
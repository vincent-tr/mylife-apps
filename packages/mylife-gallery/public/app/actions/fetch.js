'use strict';

import { createAction } from 'redux-actions';
import actionTypes from '../constants/action-types';

export const fetchGrid = createAction(actionTypes.SET_GRID);

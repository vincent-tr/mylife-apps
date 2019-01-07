'use strict';

import { createAction } from 'redux-actions';
import actionTypes      from '../constants/action-types';

export const setView = createAction(actionTypes.VIEW_SET);

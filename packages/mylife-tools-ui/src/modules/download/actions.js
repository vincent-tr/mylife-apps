'use strict';

import { createAction } from 'redux-actions';
import actionTypes from './action-types';

export const downloadFile = createAction(actionTypes.FILE);

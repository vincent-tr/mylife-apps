'use strict';

// see : https://github.com/supasate/connected-react-router/blob/master/src/actions.js

import { createAction } from 'redux-actions';
import actionTypes from './action-types';

export const setOnline = createAction(actionTypes.SET_ONLINE);

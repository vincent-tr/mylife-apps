'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';

export const getAccounts = createAction(actionTypes.QUERY_ACCOUNTS);
export const getGroups   = createAction(actionTypes.QUERY_GROUPS);

'use strict';

import { createAction } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { refresh } from './management';

export const reportingGetOperations = createAction(actionTypes.REPORTING_GET_OPERATIONS);

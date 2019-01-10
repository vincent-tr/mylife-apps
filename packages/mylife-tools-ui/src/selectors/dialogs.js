'use strict';

import { getInternalState } from './base';

const getDialogs = state => getInternalState(state);

export const getError         = state => getDialogs(state).error;
export const getInfo          = state => getDialogs(state).info;
export const getNotifications = state => getDialogs(state).notifications;

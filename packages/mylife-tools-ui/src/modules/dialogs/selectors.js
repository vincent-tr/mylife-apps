'use strict';

import { getInternalState } from '../../selectors/base';

const getDialogs = state => getInternalState(state).dialogs;

export const getBusy          = state => getDialogs(state).busy;
export const getError         = state => getDialogs(state).error;
export const getNotifications = state => getDialogs(state).notifications;

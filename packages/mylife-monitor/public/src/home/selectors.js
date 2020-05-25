'use strict';

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

export const getNagiosView = state => views.getViewReference(state, viewUids.NAGIOS_SUMMARY);

'use strict';

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

export const getView = state => views.getView(state, viewUids.UPSMON_DATA);

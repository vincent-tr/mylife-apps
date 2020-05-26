'use strict';

import { views } from 'mylife-tools-ui';
import { SELECTOR_VIEW } from './view-ids';

export const getSelectorView = state => views.getView(state, SELECTOR_VIEW);

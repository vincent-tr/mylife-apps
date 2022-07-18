'use strict';

import { views } from 'mylife-tools-ui';
import { VIEW } from './view-ids';

export const getDocument = state => views.getView(state, VIEW).first();

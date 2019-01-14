'use strict';

import { STATE_PREFIX } from '../constants/defines';

export const getInternalState = state => state[STATE_PREFIX];

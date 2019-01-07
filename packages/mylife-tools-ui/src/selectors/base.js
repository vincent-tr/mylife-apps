'use strict';

import { STATE_PREFIX } from '../constants/internal/defines';

export const getInternalState = state => state[STATE_PREFIX];

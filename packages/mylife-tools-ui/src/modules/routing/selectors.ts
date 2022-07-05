'use strict';

import { getInternalState } from '../../selectors/base';

const getRouting = state => getInternalState(state).routing;

export const getLocation = state => getRouting(state).location;

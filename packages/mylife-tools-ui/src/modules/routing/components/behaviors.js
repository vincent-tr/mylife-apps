'use strict';

import { createUseConnect } from 'react-use-redux';
import { push } from '../actions';
import { getLocation } from '../selectors';

export const useRoutingConnect = createUseConnect(
  (state) => ({ location: getLocation(state) }),
  (dispatch) => ({ navigate : location => dispatch(push(location)) })
);

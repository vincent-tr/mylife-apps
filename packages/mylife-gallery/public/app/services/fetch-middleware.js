'use strict';

import { fetchGrid } from '../actions/fetch';
import actionTypes from '../constants/action-types';

export default store => next => action => {
  next(action);

  switch(action.type) {
    case actionTypes.FETCH_GRID:
      doFetch({ url : '/api/root' }, next, fetchGrid);
      break;
  }
};

async function doFetch({ url, params }, next, action) {
  try {
    const response = await fetch(url, params);
    const data = await response.json();
    next(action(data));
  } catch(err) {
    console.error(err);
  }
}

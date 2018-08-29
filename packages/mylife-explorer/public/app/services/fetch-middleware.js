'use strict';

import actionTypes from '../constants/action-types';

export default store => next => action => {
  void store;

  next(action);

  if(action.type !== actionTypes.FETCH) {
    return;
  }

  doFetch(next, action);
};

async function doFetch(next, action) {

  const { url, params, callback, resultAction } = action.payload;

  try {
    const response = await fetch(url, params);
    const data = await response.json();

    next(resultAction(data));

    callback && callback();
  } catch(err) {
    console.error(err);
    callback && callback(err);
  }
}

'use strict';

import actionTypes from '../constants/action-types';
import { setBusy, clearBusy } from '../actions/dialogs';

export default store => next => action => {
  void store;

  next(action);

  if(action.type !== actionTypes.FETCH) {
    return;
  }

  doFetch(next, action);
};

async function doFetch(next, action) {

  next(setBusy());
  const { url, params, callback, resultAction } = action.payload;

  try {
    const response = await fetch(url, params);
    const data = await response.json();

    next(resultAction(data));

    callback && callback();
  } catch(err) {
    console.error(err);
    callback && callback(err);
  } finally {
    next(clearBusy());
  }
}

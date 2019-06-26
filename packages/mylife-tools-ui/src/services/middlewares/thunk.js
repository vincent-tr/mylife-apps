'use strict';

import { createAction } from 'redux-actions';

const errorAction = createAction('noop-error');

export default (store) => next => action => {
  if (typeof action !== 'function') {
    return next(action);
  }

  let result = action(store.dispatch, store.getState);
  if(isPromise(result)) {
    result = result.catch(err => {
      next(errorAction(err));
    });
  }
  return result;
};

function isPromise(value) {
  return value && typeof value === 'object' && typeof value.then === 'function';
}

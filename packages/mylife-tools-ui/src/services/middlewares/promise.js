'use strict';

export default (/*store*/) => next => action => {

  const { payload: promise, ...newAction } = action;

  if(!isPromise(promise)) {
    return next(action);
  }

  promise.then(
    payload => next({ ... newAction, payload }),
    error => next({ ... newAction, error }));

  return promise;
};

function isPromise(value) {
  return value && typeof value === 'object' && typeof value.then === 'function';
}

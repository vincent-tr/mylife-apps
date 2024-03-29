import { applyMiddleware, createStore, combineReducers } from 'redux';
import builtinMiddlewares from './middlewares';
import builtinReducers from '../reducers';
import { STATE_PREFIX } from '../constants/defines';

let store;

export function initStore(reducers, ...middlewares) {
  store = createStore(
    combineReducers({ [STATE_PREFIX]: builtinReducers, ...reducers }),
    applyMiddleware(...middlewares, ...builtinMiddlewares)
  );
}

export function getStore() {
  return store;
}

// https://github.com/reduxjs/redux/issues/303#issuecomment-125184409
export function observeStore(select, onChange) {
  let currentState;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

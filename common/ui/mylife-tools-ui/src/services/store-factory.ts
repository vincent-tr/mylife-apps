import { configureStore, combineReducers } from '@reduxjs/toolkit';
import builtinMiddlewares from './middlewares';

import dialogs from '../modules/dialogs/store';
import routing from '../modules/routing/store';
import io from '../modules/io/store';
import views from '../modules/views/store';
import { STATE_PREFIX } from '../constants/defines';

let store;

export function initStore(reducers, ...middlewares) {
  const reducer = combineReducers({
    ...reducers,
    [`${STATE_PREFIX}/dialogs`]: dialogs,
    [`${STATE_PREFIX}/routing`]: routing,
    [`${STATE_PREFIX}/io`]: io,
    [`${STATE_PREFIX}/views`]: views,
  });

  store = configureStore(
    {
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares, ...builtinMiddlewares)
    }
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

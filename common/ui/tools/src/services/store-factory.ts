import { configureStore, combineReducers, isPlain, createAsyncThunk as rtkCreateAsyncThunk, AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { STATE_PREFIX } from '../constants/defines';
import dialogs from '../modules/dialogs/store';
import { middleware as downloadMiddleware } from '../modules/download/store';
import { ServiceCall } from '../modules/io/service/call-engine';
import io, { connectStoreDispatcher, call } from '../modules/io/store';
import routing, { middleware as routingMiddlerware } from '../modules/routing/store';
import views from '../modules/views/store';

export interface ThunkExtraArgument {
  call: (message: ServiceCall) => Promise<any>;
}

// Re-export createAsyncThunk with proper typing for extra argument
export function createAsyncThunk<Returned, ThunkArg = void>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { extra: ThunkExtraArgument }>) {
  return rtkCreateAsyncThunk<Returned, ThunkArg, { extra: ThunkExtraArgument }>(typePrefix, payloadCreator);
}

const middlewares = [downloadMiddleware, routingMiddlerware];

if (!import.meta.env.PROD) {
  middlewares.push(createLogger({ duration: true, collapsed: () => true }));
}

let store;

export function initStore(reducers) {
  const reducer = combineReducers({
    ...reducers,
    [`${STATE_PREFIX}/dialogs`]: dialogs,
    [`${STATE_PREFIX}/routing`]: routing,
    [`${STATE_PREFIX}/io`]: io,
    [`${STATE_PREFIX}/views`]: views,
  });

  store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Allow dates for now
        serializableCheck: { isSerializable: (value: any) => isPlain(value) || value instanceof Date },
        thunk: {
          extraArgument: {
            call,
          },
        },
      }).concat(...middlewares),
  });

  connectStoreDispatcher(store.dispatch);
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

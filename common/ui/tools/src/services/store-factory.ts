import { configureStore, combineReducers, isPlain, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import { STATE_PREFIX } from '../constants/defines';
import dialogs from '../modules/dialogs/store';
import { middleware as downloadMiddleware } from '../modules/download/store';
import { connectStoreDispatcher, call, ServiceCall } from '../modules/io/api';
import io from '../modules/io/store';
import routing, { middleware as routingMiddlerware } from '../modules/routing/store';
import views from '../modules/views/store';

export interface ThunkExtraArgument {
  call: (message: ServiceCall) => Promise<any>;
}

const middlewares = [downloadMiddleware, routingMiddlerware];

if (!import.meta.env.PROD) {
  middlewares.push(createLogger({ duration: true, collapsed: () => true }));
}

// Store instance

let store;

export function initStore<M>(reducers: M) {
  store = buildStore(reducers);

  connectStoreDispatcher(store.dispatch);
}

export function getStore() {
  return store;
}

// Build store

function buildStore<M>(reducers: M) {
  const reducer = combineReducers({
    ...reducers,
    [`${STATE_PREFIX}/dialogs`]: dialogs,
    [`${STATE_PREFIX}/routing`]: routing,
    [`${STATE_PREFIX}/io`]: io,
    [`${STATE_PREFIX}/views`]: views,
  });

  return configureStore({
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
}

// Helpers to build app-store types
type GetStore<M> = ReturnType<typeof buildStore<M>>;
export type GetRootState<M> = ReturnType<GetStore<M>['getState']>;
export type GetAppDispatch<M> = GetStore<M>['dispatch'];

// Types for tools store
export type ToolsState = GetRootState<unknown>;
export type ToolsDispatch = GetAppDispatch<unknown>;

export const useToolsDispatch = useDispatch.withTypes<ToolsDispatch>();
export const useToolsSelector = useSelector.withTypes<ToolsState>();

export const createToolsAsyncThunk = createAsyncThunk.withTypes<{
  state: ToolsState;
  dispatch: ToolsDispatch;
  extra: ThunkExtraArgument;
}>();

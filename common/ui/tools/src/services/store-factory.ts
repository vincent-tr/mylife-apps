import { configureStore, combineReducers, isPlain, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';
import * as api from '../api';
import { STATE_PREFIX } from '../constants/defines';
import dialogs from '../modules/dialogs/store';
import { middleware as downloadMiddleware } from '../modules/download/store';
import { connectStoreDispatcher, call } from '../modules/io/api';
import io from '../modules/io/store';
import routing, { middleware as routingMiddlerware } from '../modules/routing/store';
import views from '../modules/views/store';

const middlewares = [downloadMiddleware, routingMiddlerware];

if (!import.meta.env.PROD) {
  middlewares.push(createLogger({ duration: true, collapsed: () => true }));
}

// Store instance

let store;

export function initStore<Reducers, Services extends BaseServices>(reducers: Reducers, servicesBuilder: (call: api.services.Call) => Services) {
  store = buildStore(reducers, servicesBuilder);

  connectStoreDispatcher(store.dispatch);
}

export function getStore() {
  return store;
}

// Build store

export function buildToolsServices(call: api.services.Call) {
  return {
    call,
    common: new api.services.Common(call),
  };
}

function buildStore<Reducers, Services>(reducers: Reducers, servicesBuilder: (call: api.services.Call) => Services) {
  void servicesBuilder;
  const reducer = combineReducers({
    ...reducers,
    [`${STATE_PREFIX}/dialogs`]: dialogs,
    [`${STATE_PREFIX}/routing`]: routing,
    [`${STATE_PREFIX}/io`]: io,
    [`${STATE_PREFIX}/views`]: views,
  });

  const services = servicesBuilder(call);

  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Allow dates for now
        serializableCheck: { isSerializable: (value: any) => isPlain(value) || value instanceof Date },
        thunk: {
          extraArgument: services,
        },
      }).concat(...middlewares),
  });
}

// Helpers to build app-store types
type BaseServices = { call: api.services.Call };

export type GetThunkExtraArgument<ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<ServiceBuilder>;
type GetStore<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<typeof buildStore<Reducers, GetThunkExtraArgument<ServiceBuilder>>>;
export type GetRootState<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<GetStore<Reducers, ServiceBuilder>['getState']>;
export type GetAppDispatch<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = GetStore<Reducers, ServiceBuilder>['dispatch'];

// Types for tools store
export type ToolsState = GetRootState<unknown, typeof buildToolsServices>;
export type ToolsDispatch = GetAppDispatch<unknown, typeof buildToolsServices>;
type ToolsThunkExtraArgument = GetThunkExtraArgument<typeof buildToolsServices>;

export const useToolsDispatch = useDispatch.withTypes<ToolsDispatch>();
export const useToolsSelector = useSelector.withTypes<ToolsState>();

export const createToolsAsyncThunk = createAsyncThunk.withTypes<{
  state: ToolsState;
  dispatch: ToolsDispatch;
  extra: ToolsThunkExtraArgument;
}>();

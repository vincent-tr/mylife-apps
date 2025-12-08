import { configureStore, combineReducers, isPlain, Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import * as api from '../api';
import dialogs from '../modules/dialogs/store';
import { middleware as downloadMiddleware } from '../modules/download/store';
import { connectStoreDispatcher, call } from '../modules/io/api';
import io from '../modules/io/store';
import routing, { middleware as routingMiddlerware } from '../modules/routing/store';
import views from '../modules/views/store';
import { STATE_PREFIX } from './store-api';

const middlewares: Middleware[] = [downloadMiddleware, routingMiddlerware];

if (!import.meta.env.PROD) {
  middlewares.push(createLogger({ duration: true, collapsed: () => true }));
}

type ToolsStore = GetStore<unknown, typeof buildToolsServices>;

// Store instance
let store: ToolsStore;

export function initStore<Reducers, Services extends BaseServices>(reducers: Reducers, servicesBuilder: (call: api.services.Call) => Services) {
  // We only keep the ToolsStore type so that we can have a global instance
  store = buildStore(reducers, servicesBuilder) as ToolsStore;

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

export type GetApi<ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<ServiceBuilder>;
type GetStore<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<typeof buildStore<Reducers, GetApi<ServiceBuilder>>>;
export type GetRootState<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = ReturnType<GetStore<Reducers, ServiceBuilder>['getState']>;
export type GetAppDispatch<Reducers, ServiceBuilder extends (call: api.services.Call) => any> = GetStore<Reducers, ServiceBuilder>['dispatch'];

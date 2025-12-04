import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { api, services } from 'mylife-tools';
import { Bots, Management, Reporting } from './api/services';
import management from './management/store';
import { initReferenceViews } from './reference/views';
import reporting from './reporting/store';

function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
    bots: new Bots(call),
    management: new Management(call),
    reporting: new Reporting(call),
  };
}

const reducers = {
  management,
  reporting,
};

services.initStore(reducers, buildAppServices);

initReferenceViews();

export type AppState = services.GetRootState<typeof reducers, typeof buildAppServices>;
export type AppDispatch = services.GetAppDispatch<typeof reducers, typeof buildAppServices>;
type ThunkExtraArgument = services.GetThunkExtraArgument<typeof buildAppServices>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
  extra: ThunkExtraArgument;
}>();

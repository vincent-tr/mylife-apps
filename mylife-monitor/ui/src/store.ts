import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { api, services } from 'mylife-tools';
import nagios from './nagios/store';
import updates from './updates/store';

function buildAppServices(call: api.services.Call) {
  return {
    ...services.buildToolsServices(call),
  };
}

const reducers = {
  nagios,
  updates,
};

services.initStore(reducers, buildAppServices);

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

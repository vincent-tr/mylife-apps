import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { services, useAction } from 'mylife-tools';
import type { reducers, buildAppServices } from './store-factory';

export type AppState = services.GetRootState<typeof reducers, typeof buildAppServices>;
export type AppDispatch = services.GetAppDispatch<typeof reducers, typeof buildAppServices>;
export type AppApi = services.GetApi<typeof buildAppServices>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppAction = useAction.withTypes<AppDispatch>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
  extra: AppApi;
}>();

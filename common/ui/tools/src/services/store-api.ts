import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useAction } from '../utils';
import type { GetRootState, GetAppDispatch, GetApi, buildToolsServices } from './store-factory'; // Import type only to avoid circular dependency

export const STATE_PREFIX = 'common';

// Types for tools store
export type ToolsState = GetRootState<unknown, typeof buildToolsServices>;
export type ToolsDispatch = GetAppDispatch<unknown, typeof buildToolsServices>;
export type ToolsApi = GetApi<typeof buildToolsServices>;

export const useToolsDispatch = useDispatch.withTypes<ToolsDispatch>();
export const useToolsSelector = useSelector.withTypes<ToolsState>();
export const useToolsAction = useAction.withTypes<ToolsDispatch>();

export const createToolsAsyncThunk = createAsyncThunk.withTypes<{
  state: ToolsState;
  dispatch: ToolsDispatch;
  extra: ToolsApi;
}>();

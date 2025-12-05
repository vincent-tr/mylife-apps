import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { GetRootState, GetAppDispatch, GetApi, buildToolsServices } from './store-factory'; // Import type only to avoid circular dependency

// Types for tools store
export type ToolsState = GetRootState<unknown, typeof buildToolsServices>;
export type ToolsDispatch = GetAppDispatch<unknown, typeof buildToolsServices>;
export type ToolsApi = GetApi<typeof buildToolsServices>;

export const useToolsDispatch = useDispatch.withTypes<ToolsDispatch>();
export const useToolsSelector = useSelector.withTypes<ToolsState>();

export const createToolsAsyncThunk = createAsyncThunk.withTypes<{
  state: ToolsState;
  dispatch: ToolsDispatch;
  extra: ToolsApi;
}>();

import { createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { GetRootState, GetAppDispatch, GetThunkExtraArgument, buildToolsServices } from './store-factory'; // Import type only to avoid circular dependency

// Types for tools store
type ToolsState = GetRootState<unknown, typeof buildToolsServices>;
type ToolsDispatch = GetAppDispatch<unknown, typeof buildToolsServices>;
type ToolsThunkExtraArgument = GetThunkExtraArgument<typeof buildToolsServices>;

export const useToolsDispatch = useDispatch.withTypes<ToolsDispatch>();
export const useToolsSelector = useSelector.withTypes<ToolsState>();

export const createToolsAsyncThunk = createAsyncThunk.withTypes<{
  state: ToolsState;
  dispatch: ToolsDispatch;
  extra: ToolsThunkExtraArgument;
}>();

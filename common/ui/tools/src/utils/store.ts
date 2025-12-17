import { AsyncThunk } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator, Dispatch, UnknownAction } from 'redux';

/**
 * Typed version of useAction hook that wraps action creators with useCallback and dispatch.
 * Supports both regular action creators and async thunks from Redux Toolkit.
 *
 * Usage:
 * ```typescript
 * // In your store setup
 * export const useAppAction = useAction.withTypes<AppDispatch>();
 *
 * // In your components
 * const myAction = useAppAction(someActionCreator);
 * const myThunk = useAppAction(someAsyncThunk);
 * ```
 *
 * Note: for now action useAction do not return value to avoid misuse in components
 */
export const useAction = {
  withTypes: <OverrideDispatchType extends Dispatch<UnknownAction>>() => {
    const useTypedDispatch = useDispatch.withTypes<OverrideDispatchType>();

    // Overload 1: Regular action creators (e.g., created with createAction)
    function useAction<A extends UnknownAction, P extends any[] = any[]>(action: ActionCreator<A, P>): (...args: P) => void; // ReturnType<OverrideDispatchType>;

    // Overload 2: Async thunks (e.g., created with createAsyncThunk)
    function useAction<Returned, Arg>(action: AsyncThunk<Returned, Arg, any>): (arg: Arg) => void; // ReturnType<OverrideDispatchType>;

    // Implementation: Works for both action creators and async thunks
    function useAction(action: any): any {
      const dispatch = useTypedDispatch();
      return useCallback(
        (...args: any[]) => {
          // No return value to avoid misuse in components
          dispatch(action(...args));
        },
        [dispatch, action]
      );
    }

    return useAction;
  },
};

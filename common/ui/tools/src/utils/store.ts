import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator, Dispatch, UnknownAction } from 'redux';

export const useAction = {
  withTypes: <OverrideDispatchType extends Dispatch<UnknownAction>>() => {
    const useTypedDispatch = useDispatch.withTypes<OverrideDispatchType>();

    return function useAction<A extends UnknownAction, P extends any[] = any[]>(action: ActionCreator<A, P>) {
      const dispatch = useTypedDispatch();
      return useCallback(
        (...args: P) => {
          // Do not return result to avoid misuse in components
          dispatch(action(...args));
        },
        [dispatch, action]
      );
    };
  },
};

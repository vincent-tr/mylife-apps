import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreatorsMapObject, ActionCreator, bindActionCreators } from 'redux';

export function useAction<A, C extends ActionCreator<A>>(action: C): C {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(action, dispatch), [dispatch, action]);
}

export function useActions<A, M extends ActionCreatorsMapObject<A>>(actions: M): M {
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => bindActionCreators(actions, dispatch), [dispatch, ...Object.values(actions)]);
}

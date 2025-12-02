import { DependencyList, useEffect } from 'react';

type Callback = () => void;

export function useLifecycle(enterOrUpdate: Callback, leave: Callback = () => {}, deps: DependencyList = []) {
  useEffect(() => {
    enterOrUpdate();
    return leave;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

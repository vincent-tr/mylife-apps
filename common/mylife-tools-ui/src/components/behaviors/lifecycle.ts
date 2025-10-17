import { DependencyList, useEffect } from 'react';

type Callback = () => void;

export function useLifecycle(onMount: Callback, onUnmout: Callback = () => {}, deps: DependencyList = []) {
  useEffect(() => {
    onMount();
    return onUnmout;
  }, deps);
}

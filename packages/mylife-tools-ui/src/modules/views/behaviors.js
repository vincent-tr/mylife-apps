'use strict';

import { useSelector } from 'react-redux';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { getView } from './selectors';

export function useSharedView(sharedViewRef, selectors = {}) {
  const enter = () => sharedViewRef.ref();
  const leave = () => sharedViewRef.unref();
  useLifecycle(enter, leave);

  return useSelector(state => {
    const view = getView(state, sharedViewRef.uid);
    const result = { view };

    for(const [key, selector] of Object.entries(selectors)) {
      result[key] = selector(view);
    }

    return result;
  });
}

export function createViewSelector(selector) {
  let cachedView = null;
  let cachedOutput = null;

  return (view) => {
    if (view !== cachedView) {
      cachedOutput = selector(view);
    }
    return cachedOutput;
  };
}

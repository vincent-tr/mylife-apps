import { useSelector } from 'react-redux';
import { useLifecycle } from '../../components/behaviors/lifecycle';
import { getView } from './store';

type FIXME_any = any;

export function useSharedView(sharedViewRef, selectors: { [key: string]: (state) => FIXME_any } = {}) {
  const enter = () => sharedViewRef.ref();
  const leave = () => sharedViewRef.unref();
  useLifecycle(enter, leave);

  return useSelector((state) => {
    const view = getView(state, sharedViewRef.uid);
    const result: FIXME_any = { view };

    for (const [key, selector] of Object.entries(selectors)) {
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
      cachedView = view;
      cachedOutput = selector(view);
    }
    return cachedOutput;
  };
}

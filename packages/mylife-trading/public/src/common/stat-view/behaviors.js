'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refStatView, unrefStatView } from './actions';
import { getStatView } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      statView: getStatView(state),
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refStatView()),
      leave: () => dispatch(unrefStatView())
    }), [dispatch])
  };
};

export function useStatView() {
  const { enter, leave, statView } = useConnect();
  useLifecycle(enter, leave);
  return { statView };
}

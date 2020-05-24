'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refErrorView, unrefErrorView } from './actions';
import { getErrorView } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      errorView: getErrorView(state),
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refErrorView()),
      leave: () => dispatch(unrefErrorView())
    }), [dispatch])
  };
};

export function useErrorView() {
  const { enter, leave, errorView } = useConnect();
  useLifecycle(enter, leave);
  return { errorView };
}

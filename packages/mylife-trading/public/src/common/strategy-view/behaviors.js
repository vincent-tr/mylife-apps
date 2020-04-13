'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refStrategyView, unrefStrategyView } from './actions';
import { getStrategyView, getStrategies } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      brokerView: getStrategyView(state),
      brokers: getStrategies(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refStrategyView()),
      leave: () => dispatch(unrefStrategyView())
    }), [dispatch])
  };
};

export function useStrategyView() {
  const { enter, leave, brokers, brokerView } = useConnect();
  useLifecycle(enter, leave);
  return { brokers, brokerView };
}

'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refBrokerView, unrefBrokerView } from './actions';
import { getBrokerView, getBrokers } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      brokerView: getBrokerView(state),
      brokers: getBrokers(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refBrokerView()),
      leave: () => dispatch(unrefBrokerView())
    }), [dispatch])
  };
};

export function useBrokerView() {
  const { enter, leave, brokers, brokerView } = useConnect();
  useLifecycle(enter, leave);
  return { brokers, brokerView };
}

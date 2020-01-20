'use strict';

import { useMemo, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { refPersonView, unrefPersonView } from './actions';
import { getPersonView, getPersons } from './selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      personView: getPersonView(state),
      persons: getPersons(state)
    })),
    ...useMemo(() => ({
      enter: () => dispatch(refPersonView()),
      leave: () => dispatch(unrefPersonView())
    }), [dispatch])
  };
};

export function usePersonView() {
  const { enter, leave, persons, personView } = useConnect();
  useLifecycle(enter, leave);
  return { persons, personView };
}

'use strict';

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from '../actions';
import { getLocation } from '../selectors';

export const useRoutingConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      location: getLocation(state)
    })),
    ...useMemo(() => ({
      navigate : location => dispatch(push(location))
    }), [dispatch])
  };
};

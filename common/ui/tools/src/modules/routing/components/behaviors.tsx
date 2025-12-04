import { useMemo } from 'react';
import { useToolsDispatch, useToolsSelector } from '../../../services/store-api';
import { navigate, getLocation } from '../store';

export const useRoutingConnect = () => {
  const dispatch = useToolsDispatch();
  return {
    location: useToolsSelector(getLocation),
    ...useMemo(
      () => ({
        navigate: (location) => dispatch(navigate(location)),
      }),
      [dispatch]
    ),
  };
};

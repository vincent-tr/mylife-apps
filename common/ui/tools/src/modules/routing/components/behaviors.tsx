import { useMemo } from 'react';
import { useToolsDispatch, useToolsSelector } from '../../../services';
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

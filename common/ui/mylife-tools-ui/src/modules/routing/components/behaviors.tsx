import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate, getLocation } from '../store';

export const useRoutingConnect = () => {
  const dispatch = useDispatch();
  return {
    location: useSelector(getLocation),
    ...useMemo(
      () => ({
        navigate: (location) => dispatch(navigate(location)),
      }),
      [dispatch]
    ),
  };
};

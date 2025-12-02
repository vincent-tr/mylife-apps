import { useDispatch, useSelector } from 'react-redux';
import { services } from 'mylife-tools';
import stats from './stats/store';

const reducers = {
  stats,
};

services.initStore(reducers);

export type AppState = services.GetRootState<typeof reducers>;
export type AppDispatch = services.GetAppDispatch<typeof reducers>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

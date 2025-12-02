import { useDispatch, useSelector } from 'react-redux';
import { services } from 'mylife-tools';
import management from './management/store';
import { initReferenceViews } from './reference/views';
import reporting from './reporting/store';

const reducers = {
  management,
  reporting,
};

services.initStore(reducers);

initReferenceViews();

export type AppState = services.GetRootState<typeof reducers>;
export type AppDispatch = services.GetAppDispatch<typeof reducers>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();

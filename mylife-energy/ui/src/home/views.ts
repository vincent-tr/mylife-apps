import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { useSharedView } from '../views-api';

const DATA = 'home-data';

export const getHomeDataView = (state: AppState) => views.getViewBySlot<api.HomeData>(state, DATA);

export function useHomeDataView() {
  return useSharedView<api.HomeData>({
    slot: DATA,
    viewCreatorApi: async (api) => await api.home.notifyHomeData(),
  });
}

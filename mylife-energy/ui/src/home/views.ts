import { views } from 'mylife-tools';
import * as api from '../api';

const DATA = 'home-data';

export const getHomeDataView = (state) => views.getViewBySlot<api.HomeData>(state, DATA);

export function useHomeDataView() {
  return views.useSharedView<api.HomeData>({
    slot: DATA,
    service: 'home',
    method: 'notifyHomeData',
  });
}

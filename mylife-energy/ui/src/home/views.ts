import { views } from 'mylife-tools';
import { HomeData } from '../api';

const DATA = 'home-data';

export const getHomeDataView = (state) => views.getViewBySlot(state, DATA) as views.View<HomeData>;

export function useHomeDataView() {
  return views.useView({
    slot: DATA,
    service: 'home',
    method: 'notifyHomeData',
  });
}

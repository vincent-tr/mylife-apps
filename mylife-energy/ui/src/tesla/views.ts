import { views } from 'mylife-tools';
import * as api from '../api';
import { AppState } from '../store-api';
import { useSharedView } from '../views-api';

const STATE = 'tesla-state';
const VIEW_STATE_ID = 'unique';

const getTeslaStateView = (state: AppState) => views.getViewBySlot<api.TeslaState>(state, STATE);
export const getTeslaState = (state: AppState) => getTeslaStateView(state)?.[VIEW_STATE_ID];

export function useTeslaState() {
  const view = useSharedView<api.TeslaState>({
    slot: STATE,
    viewCreatorApi: async (api) => await api.tesla.notifyState(),
  });

  return view?.[VIEW_STATE_ID];
}

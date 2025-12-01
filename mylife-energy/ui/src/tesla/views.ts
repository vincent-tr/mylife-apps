import { views } from 'mylife-tools';
import * as api from '../api';

const STATE = 'tesla-state';
const VIEW_STATE_ID = 'unique';

const getTeslaStateView = (state) => views.getViewBySlot<api.TeslaState>(state, STATE);
export const getTeslaState = (state) => getTeslaStateView(state)?.[VIEW_STATE_ID];

export function useTeslaState() {
  const view = views.useSharedView<api.TeslaState>({
    slot: STATE,
    service: 'tesla',
    method: 'notifyState',
  });

  return view?.[VIEW_STATE_ID];
}

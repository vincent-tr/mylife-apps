import { views } from 'mylife-tools';
import { TeslaState } from '../api';

const STATE = 'tesla-state';
const VIEW_STATE_ID = 'unique';

const getTeslaStateView = (state) => views.getViewBySlot(state, STATE) as views.View<TeslaState>;
export const getTeslaState = (state) => getTeslaStateView(state)?.[VIEW_STATE_ID];

export function useTeslaState() {
  const view = views.useView({
    slot: STATE,
    service: 'tesla',
    method: 'notifyState',
  }) as views.View<TeslaState>;

  return view?.[VIEW_STATE_ID];
}

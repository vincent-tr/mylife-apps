import { views } from 'mylife-tools';
import * as api from '../api';

const BOTS = 'bots-list';

export function useBotsView() {
  return views.useSharedView<api.Bot>({
    slot: BOTS,
    service: 'bots',
    method: 'notifyBots',
  });
}

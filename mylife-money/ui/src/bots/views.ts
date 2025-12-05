import * as api from '../api';
import { useSharedView } from '../views-api';

const BOTS = 'bots-list';

export function useBotsView() {
  return useSharedView<api.Bot>({
    slot: BOTS,
    viewCreatorApi: async (api) => await api.bots.notifyBots(),
  });
}

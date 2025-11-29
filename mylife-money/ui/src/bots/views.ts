import { views } from 'mylife-tools';

const BOTS = 'bots-list';

export function useBotsView() {
  return views.useSharedView({
    slot: BOTS,
    service: 'bots',
    method: 'notifyBots',
  });
}

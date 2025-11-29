import { views } from 'mylife-tools';

const botsViewRef = new views.SharedViewReference({
  slot: 'bots-list',
  service: 'bots',
  method: 'notifyBots',
});

export function useBots() {
  return views.useSharedView(botsViewRef);
}

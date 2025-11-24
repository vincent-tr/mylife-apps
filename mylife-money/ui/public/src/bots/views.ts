import { views } from 'mylife-tools-ui';

const botsViewRef = new views.SharedViewReference({
  uid: 'bots-list',
  service: 'bots',
  method: 'notifyBots',
});

export function useBots() {
  return views.useSharedView(botsViewRef);
}

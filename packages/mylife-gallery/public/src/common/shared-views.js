'use strict';

import { views } from 'mylife-tools-ui';

const albumViewRef = new views.SharedViewReference({
  uid: 'albums',
  service: 'album',
  method: 'notifyAlbums'
});

const getAlbums = views.createViewSelector((view) => view.valueSeq().sortBy(strategy => strategy.display).toArray());

export function useStrategyView() {
  return views.useSharedView(albumViewRef, { albums: getAlbums });
}

// ---

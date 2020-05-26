'use strict';

import { views } from 'mylife-tools-ui';

const viewRef = new views.SharedViewReference({
  uid: 'stats',
  service: 'stats',
  method: 'notifyStats'
});

export function useStatsView() {
  return views.useSharedView(viewRef);
}

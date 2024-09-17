'use strict';

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const viewRef = new views.ViewReference({
  uid: viewUids.UPDATES_DATA,
  service: 'updates',
  method: 'notify'
});

export const enter = () => async () => {
  await viewRef.attach();
};

export const leave = () => async () => {
  await viewRef.detach();
};

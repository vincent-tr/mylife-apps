'use strict';

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const viewRef = new views.ViewReference({
  uid: viewUids.UPSMON_DATA,
  service: 'upsmon',
  method: 'notify'
});

export const enter = () => async () => {
  await viewRef.attach();
};

export const leave = () => async () => {
  await viewRef.detach();
};

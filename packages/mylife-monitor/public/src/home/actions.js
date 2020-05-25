'use strict';

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const nagiosViewRef = new views.ViewReference({
  uid: viewUids.NAGIOS_SUMMARY,
  service: 'nagios',
  method: 'notifySummary'
});

export const enter = () => async (dispatch) => {
  await nagiosViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await nagiosViewRef.detach();
};

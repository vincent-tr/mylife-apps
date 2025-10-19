import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const nagiosViewRef = new views.ViewReference({
  uid: viewUids.NAGIOS_SUMMARY,
  service: 'nagios',
  method: 'notifySummary'
});

const upsmonViewRef = new views.ViewReference({
  uid: viewUids.UPSMON_SUMMARY,
  service: 'upsmon',
  method: 'notifySummary'
});

const updatesViewRef = new views.ViewReference({
  uid: viewUids.UPDATES_SUMMARY,
  service: 'updates',
  method: 'notifySummary'
});

export const enter = () => async (dispatch) => {
  await nagiosViewRef.attach();
  await upsmonViewRef.attach();
  await updatesViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await nagiosViewRef.detach();
  await upsmonViewRef.detach();
  await updatesViewRef.detach();
};

import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { createAsyncThunk } from '@reduxjs/toolkit';

const devicesViewRef = new views.ViewReference({
  uid: viewUids.DEVICES,
  service: 'stats',
  method: 'notifyDevices'
});

export const enter = createAsyncThunk('stats/enter', async () => {
  await devicesViewRef.attach();
});

export const leave = createAsyncThunk('stats/leave', async () => {
  await devicesViewRef.detach();
});

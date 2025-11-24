import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { createAsyncThunk } from '@reduxjs/toolkit';

const sensorViewRef = new views.ViewReference({
  uid: viewUids.DEVICES,
  service: 'live',
  method: 'notifyDevices',
});

const measureViewRef = new views.ViewReference({
  uid: viewUids.MEASURES,
  service: 'live',
  method: 'notifyMeasures',
});

export const enter = createAsyncThunk('live/enter', async (_, api) => {
  await sensorViewRef.attach();
  await measureViewRef.attach();
});

export const leave = createAsyncThunk('live/leave', async (_, api) => {
  await sensorViewRef.detach();
  await measureViewRef.detach();
});

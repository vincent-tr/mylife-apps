import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import * as viewUids from './view-uids';

const nagiosViewRef = new views.ViewReference({
  slot: viewUids.NAGIOS_SUMMARY,
  service: 'nagios',
  method: 'notifySummary',
});

const upsmonViewRef = new views.ViewReference({
  slot: viewUids.UPSMON_SUMMARY,
  service: 'upsmon',
  method: 'notifySummary',
});

const updatesViewRef = new views.ViewReference({
  slot: viewUids.UPDATES_SUMMARY,
  service: 'updates',
  method: 'notifySummary',
});

export const enter = createAsyncThunk('home/enter', async () => {
  await nagiosViewRef.attach();
  await upsmonViewRef.attach();
  await updatesViewRef.attach();
});

export const leave = createAsyncThunk('home/leave', async () => {
  await nagiosViewRef.detach();
  await upsmonViewRef.detach();
  await updatesViewRef.detach();
});

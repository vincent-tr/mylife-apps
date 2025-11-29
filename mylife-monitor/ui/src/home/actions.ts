import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

const nagiosViewRef = new views.ViewReference({
  slot: viewSlots.NAGIOS_SUMMARY,
  service: 'nagios',
  method: 'notifySummary',
});

const upsmonViewRef = new views.ViewReference({
  slot: viewSlots.UPSMON_SUMMARY,
  service: 'upsmon',
  method: 'notifySummary',
});

const updatesViewRef = new views.ViewReference({
  slot: viewSlots.UPDATES_SUMMARY,
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

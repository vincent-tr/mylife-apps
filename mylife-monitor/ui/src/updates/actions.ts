import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import { resetCriteria } from './store';
import * as viewUids from './view-uids';

const viewRef = new views.ViewReference({
  slot: viewUids.UPDATES_DATA,
  service: 'updates',
  method: 'notify',
});

export const enter = createAsyncThunk('updates/enter', async () => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('updates/leave', async (_, api) => {
  await viewRef.detach();
  api.dispatch(resetCriteria(null));
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { resetCriteria } from './store';

const viewRef = new views.ViewReference({
  uid: viewUids.UPDATES_DATA,
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

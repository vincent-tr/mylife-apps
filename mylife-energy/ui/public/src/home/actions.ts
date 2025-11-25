import { createAsyncThunk } from '@reduxjs/toolkit';
import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const viewRef = new views.ViewReference({
  uid: viewUids.DATA,
  service: 'home',
  method: 'notifyHomeData',
});

export const enter = createAsyncThunk('home/enter', async (_, _api) => {
  await viewRef.attach();
});

export const leave = createAsyncThunk('home/leave', async (_, _api) => {
  await viewRef.detach();
});

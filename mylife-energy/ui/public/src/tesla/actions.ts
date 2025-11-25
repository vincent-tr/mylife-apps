import { createAsyncThunk } from '@reduxjs/toolkit';
import { views, io } from 'mylife-tools-ui';
import { TeslaMode } from '../../../shared/metadata';
import * as viewUids from './view-uids';

const stateViewRef = new views.ViewReference({
  uid: viewUids.STATE,
  service: 'tesla',
  method: 'notifyState',
});

export const enter = createAsyncThunk('tesla/enter', async (_, _api) => {
  await stateViewRef.attach();
});

export const leave = createAsyncThunk('tesla/leave', async (_, _api) => {
  await stateViewRef.detach();
});

export const setMode = createAsyncThunk('tesla/setMode', async (mode: TeslaMode, api) => {
  await api.dispatch(
    io.call({
      service: 'tesla',
      method: 'setMode',
      mode,
    })
  );
});

export const setParameters = createAsyncThunk(
  'tesla/setParameters',
  async ({ fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent }: { fastLimit: number; smartLimitLow: number; smartLimitHigh: number; smartFastCurrent: number }, api) => {
    await api.dispatch(
      io.call({
        service: 'tesla',
        method: 'setParameters',
        fastLimit,
        smartLimitLow,
        smartLimitHigh,
        smartFastCurrent,
      })
    );
  }
);

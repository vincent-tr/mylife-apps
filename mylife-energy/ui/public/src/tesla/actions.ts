import { views, io } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { TeslaMode } from '../../../shared/metadata';

const stateViewRef = new views.ViewReference({
  uid: viewUids.STATE,
  service: 'tesla',
  method: 'notifyState'
});

export const enter = () => async (dispatch) => {
  await stateViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await stateViewRef.detach();
};

export const setMode = (mode: TeslaMode) => {
  return async (dispatch) => {
    await dispatch(io.call({
      service: 'tesla',
      method: 'setMode',
      mode,
    }));
  };
};

export const setParameters = ({ fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent}: { fastLimit: number, smartLimitLow: number, smartLimitHigh: number, smartFastCurrent: number}) => {
  return async (dispatch) => {
    await dispatch(io.call({
      service: 'tesla',
      method: 'setParameters',
      fastLimit,
      smartLimitLow,
      smartLimitHigh,
      smartFastCurrent,
    }));
  };
};

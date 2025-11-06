import { createAction } from 'redux-actions';
import { io, views } from 'mylife-tools-ui';
import actionTypes, { SetValues } from './types';
import * as viewUids from './view-uids';


const local = {
  setValues: createAction<SetValues>(actionTypes.SET_VALUES),
};

export enum StatsType {
	Day = 1,
	Month,
	Year,
};

export const fetchValues = (type: StatsType, timestamp: Date, sensors: string[]) => async (dispatch) => {
  const values: SetValues = await dispatch(io.call({
    service: 'stats',
    method: 'getValues',
    type,
    timestamp,
    sensors,
    timeout: 60000 // can be slower for now as we request long db queries
  }));

  dispatch(local.setValues(values));
};

const devicesViewRef = new views.ViewReference({
  uid: viewUids.DEVICES,
  service: 'stats',
  method: 'notifyDevices'
});

export const enter = () => async (dispatch) => {
  await devicesViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await devicesViewRef.detach();
};

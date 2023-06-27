import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const sensorViewRef = new views.ViewReference({
  uid: viewUids.SENSORS,
  service: 'live',
  method: 'notifySensors'
});

const measureViewRef = new views.ViewReference({
  uid: viewUids.MEASURES,
  service: 'live',
  method: 'notifyMeasures'
});

export const enter = () => async (dispatch) => {
  await sensorViewRef.attach();
  await measureViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await sensorViewRef.detach();
  await measureViewRef.detach();
};

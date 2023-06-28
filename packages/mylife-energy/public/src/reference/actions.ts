import { views } from 'mylife-tools-ui';
import { SENSORS } from './view-ids';

const sensorViewRef = new views.ViewReference({
  uid: SENSORS,
  service: 'live',
  method: 'notifyDevices'
});

export const referenceInit = () => async (dispatch) => {
  await sensorViewRef.attach();
};

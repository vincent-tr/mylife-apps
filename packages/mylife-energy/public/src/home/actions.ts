import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const viewRef = new views.ViewReference({
  uid: viewUids.DATA,
  service: 'home',
  method: 'notifyHomeData'
});

export const enter = () => async (dispatch) => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
};

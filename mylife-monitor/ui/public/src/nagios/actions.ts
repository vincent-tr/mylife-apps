import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { resetCriteria } from './store';

const viewRef = new views.ViewReference({
  uid: viewUids.NAGIOS_DATA,
  service: 'nagios',
  method: 'notify'
});

export const enter = () => async (dispatch) => {
  await viewRef.attach();
};

export const leave = () => async (dispatch) => {
  await viewRef.detach();
  dispatch(resetCriteria(null));
};

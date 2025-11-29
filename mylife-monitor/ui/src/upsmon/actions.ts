import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

const viewRef = new views.ViewReference({
  slot: viewSlots.UPSMON_DATA,
  service: 'upsmon',
  method: 'notify',
});

export const enter = () => async () => {
  await viewRef.attach();
};

export const leave = () => async () => {
  await viewRef.detach();
};

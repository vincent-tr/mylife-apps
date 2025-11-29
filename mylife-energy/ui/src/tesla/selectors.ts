import { views } from 'mylife-tools';
import { TeslaState } from '../api';
import * as viewSlots from './view-slots';

const viewStateId = 'unique';

export const getStateView = (state) => views.getViewByUid(state, viewSlots.STATE) as views.View<TeslaState>;
export const getState = (state) => getStateView(state)[viewStateId];

import { views } from 'mylife-tools';
import { TeslaState } from '../api';
import * as viewUids from './view-uids';

const viewStateId = 'unique';

export const getStateView = (state) => views.getViewByUid(state, viewUids.STATE) as views.View<TeslaState>;
export const getState = (state) => getStateView(state)[viewStateId];

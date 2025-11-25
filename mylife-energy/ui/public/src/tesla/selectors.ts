import { views } from 'mylife-tools-ui';
import { TeslaState } from '../../../shared/metadata';
import * as viewUids from './view-uids';

const viewStateId = 'unique';

export const getStateView = (state) => views.getView(state, viewUids.STATE) as views.View<TeslaState>;
export const getState = (state) => getStateView(state)[viewStateId];

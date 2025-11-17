import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { TeslaState } from '../../../shared/metadata';

const viewStateId = 'unique';

export const getStateView = state => views.getView(state, viewUids.STATE) as views.View<TeslaState>;
export const getState = state => getStateView(state)[viewStateId];

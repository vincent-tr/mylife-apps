import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { Device } from '../../../shared/metadata';

const getStats = state => state.stats;

export const getDevicesView = state => views.getView(state, viewUids.DEVICES) as views.View<Device>;

export const getMeasures = createSelector(
  [ state => getStats(state).measures ], 
  measures => Object.values(measures)
);

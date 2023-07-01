import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { LiveDevice, Measure } from '../../../shared/metadata';

const getLive = state => state.live;
export const getDeviceView = state => views.getView(state, viewUids.DEVICES) as views.View<LiveDevice>;
export const getMeasureView = state => views.getView(state, viewUids.MEASURES) as views.View<Measure>;

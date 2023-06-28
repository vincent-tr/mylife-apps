import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const getLive = state => state.live;
export const getDeviceView = state => views.getView(state, viewUids.DEVICES);
export const getMeasureView = state => views.getView(state, viewUids.MEASURES);

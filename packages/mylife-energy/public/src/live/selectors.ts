import { views, createSelector } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

const getLive = state => state.live;
export const getSensorView = state => views.getView(state, viewUids.SENSORS);
export const getMeasureView = state => views.getView(state, viewUids.MEASURES);

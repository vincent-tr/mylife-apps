import { views } from 'mylife-tools';
import * as viewUids from './view-uids';

export const getNagiosView = (state) => views.getViewByUid(state, viewUids.NAGIOS_SUMMARY);
export const getUpsmonView = (state) => views.getViewByUid(state, viewUids.UPSMON_SUMMARY);
export const getUpdatesView = (state) => views.getViewByUid(state, viewUids.UPDATES_SUMMARY);

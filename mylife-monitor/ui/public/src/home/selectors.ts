import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';

export const getNagiosView = (state) => views.getView(state, viewUids.NAGIOS_SUMMARY);
export const getUpsmonView = (state) => views.getView(state, viewUids.UPSMON_SUMMARY);
export const getUpdatesView = (state) => views.getView(state, viewUids.UPDATES_SUMMARY);

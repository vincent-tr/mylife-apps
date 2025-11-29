import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

export const getNagiosView = (state) => views.getViewByUid(state, viewSlots.NAGIOS_SUMMARY);
export const getUpsmonView = (state) => views.getViewByUid(state, viewSlots.UPSMON_SUMMARY);
export const getUpdatesView = (state) => views.getViewByUid(state, viewSlots.UPDATES_SUMMARY);

import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

export const getNagiosView = (state) => views.getViewBySlot(state, viewSlots.NAGIOS_SUMMARY);
export const getUpsmonView = (state) => views.getViewBySlot(state, viewSlots.UPSMON_SUMMARY);
export const getUpdatesView = (state) => views.getViewBySlot(state, viewSlots.UPDATES_SUMMARY);

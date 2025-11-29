import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

export const getView = (state) => views.getViewByUid(state, viewSlots.UPSMON_DATA);

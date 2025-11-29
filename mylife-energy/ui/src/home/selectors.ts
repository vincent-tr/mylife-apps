import { views } from 'mylife-tools';
import { HomeData } from '../api';
import * as viewSlots from './view-slots';

// const getHome = state => state.home;
export const getDataView = (state) => views.getViewByUid(state, viewSlots.DATA) as views.View<HomeData>;

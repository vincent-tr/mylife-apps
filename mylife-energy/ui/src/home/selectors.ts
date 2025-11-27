import { views } from 'mylife-tools';
import { HomeData } from '../api';
import * as viewUids from './view-uids';

// const getHome = state => state.home;
export const getDataView = (state) => views.getView(state, viewUids.DATA) as views.View<HomeData>;

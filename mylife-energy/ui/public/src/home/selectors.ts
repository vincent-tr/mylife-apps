import { views } from 'mylife-tools-ui';
import * as viewUids from './view-uids';
import { HomeData } from '../../../shared/metadata';

// const getHome = state => state.home;
export const getDataView = (state) => views.getView(state, viewUids.DATA) as views.View<HomeData>;

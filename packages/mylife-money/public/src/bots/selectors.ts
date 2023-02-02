import { io } from 'mylife-tools-ui';

export const getViewId = (state) => state.reporting.view;
export const getView = state => io.getView(state, getViewId(state));
export const getViewList = state => io.getViewList(state, getViewId(state));

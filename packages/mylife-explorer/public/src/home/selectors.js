'use strict';

const getHome = state => state.home;
export const getData = state => getHome(state).data;
export const showDetail = state => getHome(state).detail;

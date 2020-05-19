'use strict';

import { createAction, io } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getNagiosViewId } from './selectors';

const local = {
  setNagiosView: createAction(actionTypes.SET_NAGIOS_VIEW),
};

const nagiosViewRef = new io.ViewReference({
  criteriaSelector: () => null,
  viewSelector: getNagiosViewId,
  setViewAction: local.setNagiosView,
  service: 'nagios',
  method: 'notifySummary'
});

export const enter = () => async (dispatch) => {
  await nagiosViewRef.attach();
};

export const leave = () => async (dispatch) => {
  await nagiosViewRef.detach();
};

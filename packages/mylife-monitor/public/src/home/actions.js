'use strict';

import { createAction } from 'mylife-tools-ui';
import { ViewReference } from '../common/action-tools';
import actionTypes from './action-types';
import { getNagiosViewId } from './selectors';

const local = {
  setNagiosView: createAction(actionTypes.SET_NAGIOS_VIEW),
};

const nagiosViewRef = new ViewReference({
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

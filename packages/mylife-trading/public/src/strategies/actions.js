'use strict';

import { createAction, io, dialogs } from 'mylife-tools-ui';
import { createOrUpdateView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getViewId } from './selectors';
import { renderObject } from '../common/metadata-utils';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
};

const getStrategies = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'strategy',
  method: 'notify'
});
  
const clearStrategies = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getStrategies());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearStrategies());
};

export const add = () => async (dispatch) => {
  const values = {
    display: 'Nouveau',
    implementation: 'forex-scalping-m1-extreme',
    enabled: false,
    broker: null,
    epic: 'A remplir',
    risk: 5
  };

  const strategy = await dispatch(io.call({
    service: 'strategy',
    method: 'create',
    values
  }));

  dispatch(local.showSuccess(`${renderObject(strategy)} créé`));
};

export const update = (strategy, changes) => async (dispatch) => {
  const updatedStrategy = await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: changes
  }));

  dispatch(local.showSuccess(`${renderObject(updatedStrategy)} mis à jour`));
};

export const remove = (strategy) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'delete',
    id: strategy._id
  }));

  dispatch(local.showSuccess(`${renderObject(strategy)} supprimé`));
};
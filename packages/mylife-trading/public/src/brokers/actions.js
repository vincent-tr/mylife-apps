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

const getBrokers = () => createOrUpdateView({
  criteriaSelector: () => null,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'broker',
  method: 'notify'
});
  
const clearBrokers = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

export const enter = () => async (dispatch) => {
  await dispatch(getBrokers());
};

export const leave = () => async (dispatch) => {
  await dispatch(clearBrokers());
};

export const add = () => async (dispatch) => {
  const values = {
    display: 'Nouveau',
    key: 'A remplir',
    identifier: 'A remplir',
    password: 'A remplir',
    demo: false
  };

  const broker = await dispatch(io.call({
    service: 'broker',
    method: 'create',
    values
  }));

  dispatch(local.showSuccess(`${renderObject(broker)} créé`));
};

export const update = (broker, changes) => async (dispatch) => {
  await dispatch(io.call({
    service: 'broker',
    method: 'update',
    id: broker._id,
    values: changes
  }));
};

export const remove = (broker) => async (dispatch) => {
  await dispatch(io.call({
    service: 'broker',
    method: 'delete',
    id: broker._id
  }));

  dispatch(local.showSuccess(`${renderObject(broker)} supprimé`));
};
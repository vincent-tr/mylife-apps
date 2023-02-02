'use strict';

import { createAction, io, dialogs, views } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

type FIXME_any = any;
type Bot = FIXME_any;

export const createBot = (object: Partial<Bot>) => async (dispatch) => {
  const id = await dispatch(io.call({
    service: 'bots',
    method: 'createBot',
    object
  }));

  dispatch(dialogs.notificationShow({ message: 'Robot créé', type: dialogs.notificationShow.types.success }));

  return id;
};

export const updateBot = (object: Partial<Bot>) => async (dispatch) => {
  await dispatch(io.call({
    service: 'bots',
    method: 'updateBot',
    object
  }));

  dispatch(dialogs.notificationShow({ message: 'Robot modifié', type: dialogs.notificationShow.types.success }));
};

export const deleteBot = (id: string) => async (dispatch) => {
  await dispatch(io.call({
    service: 'bots',
    method: 'deleteBot',
    id
  }));

  dispatch(dialogs.notificationShow({ message: 'Robot supprimé', type: dialogs.notificationShow.types.success }));
};

export const startBot = (id: string) => async (dispatch) => {
  await dispatch(io.call({
    service: 'bots',
    method: 'startBot',
    id
  }));

  dispatch(dialogs.notificationShow({ message: 'Robot démarré', type: dialogs.notificationShow.types.success }));
};

export const clearBotState = (id: string) => async (dispatch) => {
  await dispatch(io.call({
    service: 'bots',
    method: 'clearBotState',
    id
  }));

  dispatch(dialogs.notificationShow({ message: 'État supprimé', type: dialogs.notificationShow.types.success }));
};

export const fetchRuns = (botId: string) => views.createOrUpdateView({
  criteriaSelector: () => ({ botId }),
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'bots',
  method: 'notifyBotRuns'
});

export const clearRuns = () => views.deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
});

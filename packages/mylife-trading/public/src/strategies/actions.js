'use strict';

import { io, dialogs, services } from 'mylife-tools-ui';

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
};

export const add = () => async (dispatch) => {
  const values = {
    display: 'Nouveau',
    implementation: 'm1-rsi-bb',
    enabled: false,
    broker: null,
    instrumentId: 'A remplir',
    risk: 5
  };

  const strategy = await dispatch(io.call({
    service: 'strategy',
    method: 'create',
    values
  }));

  dispatch(local.showSuccess(`${services.renderObject(strategy)} créé`));
};

export const update = (strategy, changes) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'update',
    id: strategy._id,
    values: changes
  }));
};

export const remove = (strategy) => async (dispatch) => {
  await dispatch(io.call({
    service: 'strategy',
    method: 'delete',
    id: strategy._id
  }));

  dispatch(local.showSuccess(`${services.renderObject(strategy)} supprimé`));
};

export const removeStats = (strategy) => async (dispatch) => {
  const count = await dispatch(io.call({
    service: 'stat',
    method: 'deleteByStrategy',
    strategyId: strategy._id
  }));

  dispatch(local.showSuccess(`${count} données de statistiques supprimées`));
};

export const removeErrors = (strategy) => async (dispatch) => {
  const count = await dispatch(io.call({
    service: 'error',
    method: 'deleteByStrategy',
    strategyId: strategy._id
  }));

  dispatch(local.showSuccess(`${count} données d'erreurs supprimées`));
};
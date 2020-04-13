'use strict';

import { io, dialogs } from 'mylife-tools-ui';
import { renderObject } from '../common/metadata-utils';

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
};

export const add = () => async (dispatch) => {
  const values = {
    display: 'Nouveau',
    implementation: 'forex-scalping-m1-extreme',
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

  dispatch(local.showSuccess(`${renderObject(strategy)} créé`));
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

  dispatch(local.showSuccess(`${renderObject(strategy)} supprimé`));
};
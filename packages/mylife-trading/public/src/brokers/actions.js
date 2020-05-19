'use strict';

import { io, dialogs, services } from 'mylife-tools-ui';

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
};

const defaultTestSettings = {
  instrumentId: 'A remplir',
  resolution: 'A remplir',
  spread: 1
};

const defaultCredentials = {
  key: 'A remplir',
  identifier: 'A remplir',
  password: 'A remplir'
}

export const add = () => async (dispatch) => {
  const values = {
    display: 'Nouveau',
    type: 'backtest',
    testSettings: defaultTestSettings
  };

  const broker = await dispatch(io.call({
    service: 'broker',
    method: 'create',
    values
  }));

  dispatch(local.showSuccess(`${services.renderObject(broker)} créé`));
};

export const update = (broker, changes) => async (dispatch) => {
  switch(changes.type) {
    case 'ig-demo':
    case 'ig-real':
      if(broker.testSettings) {
        changes.testSettings = null;
      }
      if(!broker.credentials && !changes.credentials) {
        changes.credentials = defaultCredentials;
      }
      break;

    case 'backtest':
      if(broker.credentials) {
        changes.credentials = null;
      }
      if(!broker.testSettings && !changes.testSettings) {
        changes.testSettings = defaultTestSettings;
      }
      break;
  }

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

  dispatch(local.showSuccess(`${services.renderObject(broker)} supprimé`));
};
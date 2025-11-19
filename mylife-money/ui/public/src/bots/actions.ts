import { io, dialogs } from 'mylife-tools-ui';

export const startBot = (id: string) => async (dispatch) => {
  await dispatch(io.call({
    service: 'bots',
    method: 'startBot',
    id
  }));

  dispatch(dialogs.showNotification({ message: 'Robot démarré', type: 'success' }));
};

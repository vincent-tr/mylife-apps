import { dialogs } from 'mylife-tools';
import { createAppAsyncThunk } from '../store';

export const startBot = createAppAsyncThunk('bots/startBot', async (id: string, api) => {
  await api.extra.call({
    service: 'bots',
    method: 'startBot',
    id,
  });

  api.dispatch(dialogs.showNotification({ message: 'Robot démarré', type: 'success' }));
});

import { dialogs } from 'mylife-tools';
import { createAppAsyncThunk } from '../store-api';

export const startBot = createAppAsyncThunk('bots/startBot', async (id: string, api) => {
  await api.extra.bots.startBot(id);
  api.dispatch(dialogs.showNotification({ message: 'Robot démarré', type: 'success' }));
});

import { createAsyncThunk, dialogs } from 'mylife-tools-ui';

export const startBot = createAsyncThunk('bots/startBot', async (id: string, api) => {
  await api.extra.call({
    service: 'bots',
    method: 'startBot',
    id,
  });

  api.dispatch(dialogs.showNotification({ message: 'Robot démarré', type: 'success' }));
});

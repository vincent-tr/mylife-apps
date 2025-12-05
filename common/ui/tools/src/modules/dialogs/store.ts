import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../services/store-api';
import { createToolsAsyncThunk } from '../../services/store-api';
import { abortableDelay } from '../../utils';
import { Notification, NotificationType } from './types';

interface ErrorAction extends Action {
  error: Error;
}

interface DialogState {
  error: Error | null;
  notifications: Notification[];
}

const initialState: DialogState = {
  error: null,
  notifications: [],
};

const dialogSlice = createSlice({
  name: `${STATE_PREFIX}/dialogs`,
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
    showNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    dismissNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },

  extraReducers(builder) {
    builder.addMatcher(
      (action) => action.error,
      (state, action: ErrorAction) => {
        state.error = action.error;

        console.error('Got error action', action.error);
        console.error(action.error.stack);
      }
    );
  },

  selectors: {
    getError: (state) => state.error,
    getNotifications: (state) => state.notifications,
  },
});

const local = {
  show: dialogSlice.actions.showNotification,
  dismiss: dialogSlice.actions.dismissNotification,
};

// https://gist.github.com/markerikson/7621fca0e9704e99db5598bed0db861d
let notificationIdGenerator = 0;

export const showNotification = createToolsAsyncThunk(
  `${STATE_PREFIX}/dialogs/showNotification`,
  async ({ message, type = 'info', dismissAfter = 5000 }: { message: string; type?: NotificationType; dismissAfter?: number }, api) => {
    const id = ++notificationIdGenerator;
    api.dispatch(local.show({ message, type, id }));

    if (dismissAfter) {
      try {
        await abortableDelay(dismissAfter, api.signal);
      } finally {
        api.dispatch(local.dismiss(id));
      }
    }
  }
);

export const { clearError, dismissNotification, clearNotifications } = dialogSlice.actions;
export const { getError, getNotifications } = dialogSlice.selectors;

export default dialogSlice.reducer;

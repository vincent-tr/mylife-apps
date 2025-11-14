import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import { Notification, NotificationType } from './types';

interface DialogState {
  busy          : boolean,
  error         : Error | null,
  notifications : Notification[]
}

const initialState: DialogState = {
  busy          : false,
  error         : null,
  notifications : []
};

const dialogSlice = createSlice({
  name: 'dialogs',
  reducerPath: `${STATE_PREFIX}/dialogs}`,
  initialState,

  reducers: {
    // TODO: action.error?

    setBusy(state, action: PayloadAction<boolean>) {
      state.busy = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    showNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    dismissNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },

  selectors: {
    getBusy: (state) => state.busy,
    getError: (state) => state.error,
    getNotifications: (state) => state.notifications,
  }
});

const local = {
  show: dialogSlice.actions.showNotification,
  dismiss: dialogSlice.actions.dismissNotification,
}

// https://gist.github.com/markerikson/7621fca0e9704e99db5598bed0db861d
let notificationIdGenerator = 0;

export const showNotification = createAsyncThunk(
  `${STATE_PREFIX}/dialogs/showNotification`,
  async({message, type = 'info', dismissAfter = 5000}: { message: string, type: NotificationType, dismissAfter: number }, api) => {
    const id = ++notificationIdGenerator;
    api.dispatch(local.show({ message, type, id }));

    if (dismissAfter) {
      setTimeout(() => api.dispatch(local.dismiss(id)), dismissAfter);
    }
  }
);

export const { setBusy, clearError, dismissNotification, clearNotifications } = dialogSlice.actions;
export const { getBusy, getError, getNotifications } = dialogSlice.selectors;

export default dialogSlice.reducer;

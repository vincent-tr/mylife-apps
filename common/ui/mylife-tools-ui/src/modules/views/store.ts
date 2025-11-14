import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STATE_PREFIX } from '../../constants/defines';
import * as io from '../io';

interface SetViewPayload {
  viewId: string;
  uid: string;
}

interface ViewsState {
  viewReferences: { [uid: string]: string };
  refCounts: { [uid: string]: number };
}

const initialState: ViewsState = {
  viewReferences: {},
  refCounts: {},
};

const viewsSlice = createSlice({
  name: 'views',
  reducerPath: `${STATE_PREFIX}/views`,
  initialState,
  reducers: {
    setView(state, action: PayloadAction<SetViewPayload>) {
      const { viewId, uid } = action.payload;

      if (viewId === null) {
        delete state.viewReferences[uid];
      } else {
        state.viewReferences[uid] = viewId;
      }
    },
    setOnline(state) {
      state.viewReferences = {};
    },
    ref(state, action: PayloadAction<string>) {
      const uid = action.payload;
      addRef(state.refCounts, uid, 1);
    },
    unref(state, action: PayloadAction<string>) {
      const uid = action.payload;
      addRef(state.refCounts, uid, -1);
    },
  },

  selectors: {
    getViewId: (state, uid) => state.viewReferences[uid],
    getRefCount: (state, uid) => state.refCounts[uid] || 0,
  },
});

function addRef(refCounts: { [uid: string]: number }, uid: string, value: number) {
  const currentValue = refCounts[uid] || 0;
  const newValue = currentValue + value;

  if (newValue > 0) {
    refCounts[uid] = newValue;
  } else {
    delete refCounts[uid];
  }
}

const local = {
  getViewId: viewsSlice.selectors.getViewId,
};

export const getView = (state, uid) => io.getView(state, local.getViewId(state, uid))

export const { setView, setOnline, ref, unref } = viewsSlice.actions;
export const { getViewId, getRefCount } = viewsSlice.selectors;

export default viewsSlice.reducer;
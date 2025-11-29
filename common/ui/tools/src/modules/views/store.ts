import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api';
import { STATE_PREFIX } from '../../constants/defines';
import * as io from '../io';
import { ViewChange } from '../io/service';
import { View } from './index';

interface SetViewPayload {
  viewId: string;
  uid: string;
}

type ViewChangePayload = ViewChange;

interface ViewsState {
  viewReferences: { [uid: string]: string };
  refCounts: { [uid: string]: number };
  views: { [viewId: string]: View<api.Entity> };
}

const initialState: ViewsState = {
  viewReferences: {},
  refCounts: {},
  views: {},
};

const emptyView: View<api.Entity> = {};

const viewsSlice = createSlice({
  name: `${STATE_PREFIX}/views`,
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
    ref(state, action: PayloadAction<string>) {
      const uid = action.payload;
      addRef(state.refCounts, uid, 1);
    },
    unref(state, action: PayloadAction<string>) {
      const uid = action.payload;
      addRef(state.refCounts, uid, -1);
    },
    viewChange(state, action: PayloadAction<ViewChangePayload>) {
      const { viewId, list } = action.payload;
      if (!state.views[viewId]) {
        state.views[viewId] = {};
      }
      const view = state.views[viewId];
      for (const item of list) {
        switch (item.type) {
          case 'set': {
            const { object } = item;
            view[object._id] = object;
            break;
          }
          case 'unset':
            delete view[item.objectId];
            break;
        }
      }
    },
    viewClose(state, action: PayloadAction<string>) {
      const viewId = action.payload;
      delete state.views[viewId];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(io.setOnline, (state, action: PayloadAction<boolean>) => {
      if (!action.payload) {
        state.viewReferences = {};
        state.views = {};
      }
    });
  },

  selectors: {
    getViewId: (state, uid) => state.viewReferences[uid],
    getRefCount: (state, uid) => state.refCounts[uid] || 0,
    getViewById: (state, viewId: string) => state.views[viewId] || emptyView,
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
  getViewById: viewsSlice.selectors.getViewById,
};

export const getViewByUid = (state, uid) => local.getViewById(state, local.getViewId(state, uid));

export const { setView, ref, unref, viewChange, viewClose } = viewsSlice.actions;
export const { getViewId, getRefCount, getViewById } = viewsSlice.selectors;

export default viewsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api';
import { STATE_PREFIX } from '../../constants/defines';
import * as io from '../io';
import { ViewChange } from '../io/service';
import { View } from './index';

interface SetViewPayload {
  viewId: string;
  slot: string;
}

type ViewChangePayload = ViewChange;

interface ViewsState {
  // Maps view slots (frontend logical identifiers) to backend view IDs
  viewReferences: { [slot: string]: string };
  // Reference counts for shared views - tracks how many components are using each slot
  // Used exclusively by SharedViewReference to determine when to create/destroy views
  refCounts: { [slot: string]: number };
  // Actual view data from backend, indexed by backend view ID
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
      const { viewId, slot } = action.payload;

      if (viewId === null) {
        delete state.viewReferences[slot];
      } else {
        state.viewReferences[slot] = viewId;
      }
    },
    ref(state, action: PayloadAction<string>) {
      const slot = action.payload;
      addRef(state.refCounts, slot, 1);
    },
    unref(state, action: PayloadAction<string>) {
      const slot = action.payload;
      addRef(state.refCounts, slot, -1);
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
    getViewId: (state, slot: string) => state.viewReferences[slot],
    getRefCount: (state, slot: string) => state.refCounts[slot] || 0,
    getViewById: (state, viewId: string) => state.views[viewId] || emptyView,
  },
});

function addRef(refCounts: { [slot: string]: number }, slot: string, value: number) {
  const currentValue = refCounts[slot] || 0;
  const newValue = currentValue + value;

  if (newValue > 0) {
    refCounts[slot] = newValue;
  } else {
    delete refCounts[slot];
  }
}

const local = {
  getViewId: viewsSlice.selectors.getViewId,
  getViewById: viewsSlice.selectors.getViewById,
};

export const getViewByUid = (state, slot: string) => local.getViewById(state, local.getViewId(state, slot));

export const { setView, ref, unref, viewChange, viewClose } = viewsSlice.actions;
export const { getViewId, getRefCount, getViewById } = viewsSlice.selectors;

export default viewsSlice.reducer;

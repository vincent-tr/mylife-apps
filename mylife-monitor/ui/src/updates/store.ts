import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { views } from 'mylife-tools';
import * as viewSlots from './view-slots';

type FIXME_any = any;

interface UpdatesState {
  criteria: Criteria;
}

interface Criteria {
  onlyProblems: boolean;
}

const initialState: UpdatesState = {
  criteria: {
    onlyProblems: true,
  },
};

const updatesSlice = createSlice({
  name: 'updates',
  initialState,
  reducers: {
    setCriteria(state, action: PayloadAction<Criteria>) {
      state.criteria = action.payload;
    },
    resetCriteria(state, _action) {
      state.criteria = initialState.criteria;
    },
  },
  selectors: {
    getCriteria: (state) => state.criteria,
  },
});

const local = {
  getCriteria: updatesSlice.selectors.getCriteria,
  setCriteria: updatesSlice.actions.setCriteria,
};

export const resetCriteria = updatesSlice.actions.resetCriteria;

export const changeCriteria = createAsyncThunk('updates/changeCriteria', async (changes: Partial<Criteria>, api) => {
  const state = api.getState();
  const criteria = local.getCriteria(state as FIXME_any);
  const newCriteria = { ...criteria, ...changes };
  api.dispatch(local.setCriteria(newCriteria));
});

export const getCriteria = updatesSlice.selectors.getCriteria;
export const getView = (state) => views.getViewBySlot(state, viewSlots.UPDATES_DATA);

export const getDisplayView = createSelector([getView, getCriteria], (view, criteria) => {
  if (criteria.onlyProblems) {
    return views.filter(view, (item) => (item as FIXME_any).status !== 'uptodate');
  } else {
    return view;
  }
});

export default updatesSlice.reducer;

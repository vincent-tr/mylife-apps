import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { download, io, views } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '../api';
import { createAppAsyncThunk } from '../store';

interface ReportingState {
  view: string | null;
}

const initialState: ReportingState = {
  view: null,
};

const reportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    setViewId(state, action: PayloadAction<string>) {
      state.view = action.payload;
    },
    clearViewId(state) {
      state.view = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(io.setOnline, (state, action) => {
      if (!action.payload) {
        state.view = null;
      }
    });
  },
  selectors: {
    getViewId: (state) => state.view,
  },
});

export default reportingSlice.reducer;

export const { setViewId, clearViewId } = reportingSlice.actions;
export const { getViewId } = reportingSlice.selectors;

const local = {
  getViewId: reportingSlice.selectors.getViewId,
};

export const getView = (state) => views.getViewById(state, local.getViewId(state));

// sort on id, should be usefull with report's custom keys
export const getSortedViewList = createSelector([getView], (view) => Object.values(view).sort((item1, item2) => (item1._id < item2._id ? -1 : 1)));

export interface DownloadExportParams {
  criteria: ReportingCriteria;
  display: ReportingDisplay;
  type: 'month' | 'year';
  fileName: string;
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const downloadExport = createAppAsyncThunk('reporting/downloadExport', async ({ criteria, display, type, fileName }: DownloadExportParams, api) => {
  let content: string;
  switch (type) {
    case 'month':
      content = await api.extra.reporting.exportGroupByMonth(criteria, display);
      break;
    case 'year':
      content = await api.extra.reporting.exportGroupByYear(criteria, display);
      break;
    default:
      throw new Error(`Unknown export type: ${type}`);
  }

  api.dispatch(download.file({ name: fileName, mime: XLSX_MIME, content }));
});

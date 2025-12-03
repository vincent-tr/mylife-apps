import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { download, io, views } from 'mylife-tools';
import { createAppAsyncThunk } from '../store';

type FIXME_any = any;

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
  criteria: FIXME_any;
  display: FIXME_any;
  method: 'exportGroupByMonth' | 'exportGroupByYear';
  fileName: string;
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const downloadExport = createAppAsyncThunk('reporting/downloadExport', async ({ criteria, display, method, fileName }: DownloadExportParams, api) => {
  const content = (await api.extra.call({
    service: 'reporting',
    method,
    criteria,
    display,
  })) as string;

  api.dispatch(download.file({ name: fileName, mime: XLSX_MIME, content }));
});

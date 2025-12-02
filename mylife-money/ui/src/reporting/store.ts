import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, download, io, views } from 'mylife-tools';

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
/*
export const getGroupByMonth = (criteria) =>
  views.createOrUpdateView({
    criteriaSelector: () => criteria,
    viewSelector: local.getViewId,
    setViewAction: local.setView,
    service: 'reporting',
    method: 'notifyGroupByMonth',
  });

export const getGroupByYear = (criteria) =>
  views.createOrUpdateView({
    criteriaSelector: () => criteria,
    viewSelector: local.getViewId,
    setViewAction: local.setView,
    service: 'reporting',
    method: 'notifyGroupByYear',
  });

const clearReportingView = () =>
  views.deleteView({
    viewSelector: local.getViewId,
    setViewAction: local.setView,
  });

export const reportingLeave = createAsyncThunk('reporting/reportingLeave', async (_, api) => {
  await api.dispatch(clearReportingView());
});
*/

export interface DownloadExportParams {
  criteria: FIXME_any;
  display: FIXME_any;
  method: 'exportGroupByMonth' | 'exportGroupByYear';
  fileName: string;
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const downloadExport = createAsyncThunk('reporting/downloadExport', async ({ criteria, display, method, fileName }: DownloadExportParams, api) => {
  const content: string = await api.extra.call({
    service: 'reporting',
    method,
    criteria,
    display,
  });

  api.dispatch(download.file({ name: fileName, mime: XLSX_MIME, content }));
});

export const exportGroupByMonth = createExportAction({
  service: 'reporting',
  method: 'exportGroupByMonth',
  fileName: 'groupes-par-mois.xlsx',
});

export const exportGroupByYear = createExportAction({
  service: 'reporting',
  method: 'exportGroupByYear',
  fileName: 'groupes-par-an.xlsx',
});

function createExportAction({ service, method, fileName }) {
  return createAsyncThunk('reporting/' + method, async ({ criteria, display }: { criteria: FIXME_any; display: FIXME_any }, api) => {
    const content: string = await api.extra.call({
      service,
      method,
      criteria,
      display,
    });

    api.dispatch(download.file({ name: fileName, mime: XLSX_MIME, content }));
  });
}

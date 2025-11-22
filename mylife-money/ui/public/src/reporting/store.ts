import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { download, io, views } from 'mylife-tools-ui';

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
    setCriteria(state, action: PayloadAction<string | null>) {
      state.view = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(io.setOnline, (state, action) => {
      if (!action.payload) {
        state.view = null;
      }
    });
  },
  selectors:{
    getViewId: (state) => state.view,
  },
});

export default reportingSlice.reducer;

const local = {
  setView: reportingSlice.actions.setCriteria,
  getViewId: reportingSlice.selectors.getViewId,
}

export const getView = state => io.getView(state, local.getViewId(state));

// sort on id, should be usefull with report's custom keys
export const getSortedViewList = createSelector(
  [ getView ],
  (view) => Object.values(view).sort((item1, item2) => item1._id < item2._id ? -1 : 1)
);

export const getGroupByMonth = (criteria) => views.createOrUpdateView({
  criteriaSelector: () => criteria,
  viewSelector: local.getViewId,
  setViewAction: local.setView,
  service: 'reporting',
  method: 'notifyGroupByMonth'
});

export const getGroupByYear = (criteria) => views.createOrUpdateView({
  criteriaSelector: () => criteria,
  viewSelector: local.getViewId,
  setViewAction: local.setView,
  service: 'reporting',
  method: 'notifyGroupByYear'
});

const clearReportingView = () => views.deleteView({
  viewSelector: local.getViewId,
  setViewAction: local.setView,
});

export const reportingLeave = () => async (dispatch) => {
  await dispatch(clearReportingView());
};

export const exportGroupByMonth = createExportAction({
  service: 'reporting',
  method: 'exportGroupByMonth',
  fileName: 'groupes-par-mois.xlsx'
});

export const exportGroupByYear = createExportAction({
  service: 'reporting',
  method: 'exportGroupByYear',
  fileName: 'groupes-par-an.xlsx'
});

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function createExportAction({ service, method, fileName }) {
  return (criteria, display) => async (dispatch) => {

    const content = await dispatch(io.call({
      service,
      method,
      criteria,
      display
    }));

    dispatch(download.file({ name: fileName, mime: XLSX_MIME, content }));
  };
}

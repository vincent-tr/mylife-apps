'use strict';

import { createAction, io, download } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getViewId } from './selectors';
import { createOrUpdateView, deleteView } from '../actions/tools';

const local = {
  setView: createAction(actionTypes.SET_VIEW),
};

export const getGroupByMonth = (criteria) => createOrUpdateView({
  criteriaSelector: () => criteria,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'reporting',
  method: 'notifyGroupByMonth'
});

export const getGroupByYear = (criteria) => createOrUpdateView({
  criteriaSelector: () => criteria,
  viewSelector: getViewId,
  setViewAction: local.setView,
  service: 'reporting',
  method: 'notifyGroupByYear'
});

const clearReportingView = () => deleteView({
  viewSelector: getViewId,
  setViewAction: local.setView
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

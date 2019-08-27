'use strict';

import { createAction, io, download } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getViewId } from '../selectors/reporting';
import { createOrUpdateView, deleteView } from './tools';

const local = {
  setView: createAction(actionTypes.REPORTING_SET_VIEW),
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
  fileName: 'groupes-par-mois.txt'
});

export const exportGroupByYear = createExportAction({
  service: 'reporting',
  method: 'exportGroupByYear',
  fileName: 'groupes-par-an.txt'
});

function createExportAction({ service, method, fileName }) {
  return (criteria, display) => async (dispatch) => {

    const content = await dispatch(io.call({
      service,
      method,
      criteria,
      display
    }));

console.log(content)

    dispatch(download.file({ name: fileName, mime: 'text/plain', content }));
  };

}

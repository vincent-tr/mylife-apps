import { ReportGroupByPeriod, ReportingCriteria } from '../api';
import { AppApi } from '../store-api';
import { useCriteriaView } from '../views-api';
import { clearViewId, getViewId, setViewId } from './store';

export function useReportingView(type: 'month' | 'year', criteria: ReportingCriteria) {
  let viewCreatorApi: (api: AppApi, criteria: ReportingCriteria) => Promise<string>;
  switch (type) {
    case 'month':
      viewCreatorApi = async (api, criteria) => api.reporting.notifyGroupByMonth(criteria);
      break;
    case 'year':
      viewCreatorApi = async (api, criteria) => api.reporting.notifyGroupByYear(criteria);
      break;
    default:
      throw new Error(`Unsupported reporting view type: ${type}`);
  }

  return useCriteriaView<ReportGroupByPeriod, ReportingCriteria>({
    viewCreatorApi,
    criteria,

    setViewIdAction: setViewId,
    clearViewIdAction: clearViewId,
    viewIdSelector: getViewId,
  });
}

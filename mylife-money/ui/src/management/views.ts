import { Operation, OperationViewCriteria } from '../api';
import { useAppSelector } from '../store-api';
import { useCriteriaView } from '../views-api';
import { clearOperationViewId, getCriteria, getOperationViewId, setOperationViewId } from './store';

export function useOperationView() {
  const criteria = useAppSelector(getCriteria);

  return useCriteriaView<Operation, OperationViewCriteria>({
    viewCreatorApi: async (api, criteria) => await api.management.notifyOperations(criteria),
    criteria,
    setViewIdAction: setOperationViewId,
    clearViewIdAction: clearOperationViewId,
    viewIdSelector: getOperationViewId,
  });
}

import { views } from 'mylife-tools';
import { Account, Group } from '../api';
import { AppState } from '../store-api';
import { initStaticView } from '../views-api';

const ACCOUNTS = 'reference-accounts';
const GROUPS = 'reference-groups';

export const getAccountsView = (state: AppState) => views.getViewBySlot<Account>(state, ACCOUNTS);
export const getGroupsView = (state: AppState) => views.getViewBySlot<Group>(state, GROUPS);

export function initReferenceViews() {
  initStaticView({
    slot: ACCOUNTS,
    viewCreatorApi: async (api) => await api.common.notifyAccounts(),
  });

  initStaticView({
    slot: GROUPS,
    viewCreatorApi: async (api) => await api.common.notifyGroups(),
  });
}

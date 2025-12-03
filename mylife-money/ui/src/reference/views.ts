import { views } from 'mylife-tools';
import { Account, Group } from '../api';

const ACCOUNTS = 'reference-accounts';
const GROUPS = 'reference-groups';

export const getAccountsView = (state) => views.getViewBySlot<Account>(state, ACCOUNTS);
export const getGroupsView = (state) => views.getViewBySlot<Group>(state, GROUPS);

export function initReferenceViews() {
  views.initStaticView({
    slot: ACCOUNTS,
    service: 'common',
    method: 'notifyAccounts',
  });

  views.initStaticView({
    slot: GROUPS,
    service: 'common',
    method: 'notifyGroups',
  });
}

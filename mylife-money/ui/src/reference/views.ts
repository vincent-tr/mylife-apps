import { views } from 'mylife-tools';

const ACCOUNTS = 'reference-accounts';
const GROUPS = 'reference-groups';

export const getAccountsView = (state) => views.getViewBySlot(state, ACCOUNTS);
export const getGroupsView = (state) => views.getViewBySlot(state, GROUPS);

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

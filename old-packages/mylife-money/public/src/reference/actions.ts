'use strict';

import { views } from 'mylife-tools-ui';
import { ACCOUNTS, GROUPS } from './view-ids';

const accountViewRef = new views.ViewReference({
  uid: ACCOUNTS,
  service: 'common',
  method: 'notifyAccounts'
});


const groupViewRef = new views.ViewReference({
  uid: GROUPS,
  service: 'common',
  method: 'notifyGroups'
});

export const referenceInit = () => async (dispatch) => {
  await accountViewRef.attach();
  await groupViewRef.attach();
};

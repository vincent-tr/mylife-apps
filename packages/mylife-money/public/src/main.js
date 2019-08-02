'use strict';

import { React, services, io } from 'mylife-tools-ui';
import reducers from './reducers';

import { referenceInit } from './actions/reference';

import icons from './components/icons';
import Home from './components/home';
import Management from './components/management';
import GroupAmountByMonth from './components/reporting/group-amount-by-month';

services.initStore(reducers);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
  { location: '/reports/group-amount-by-month', name: 'Montant par mois de groupes', icon: icons.tabs.Reporting, renderer: () => <GroupAmountByMonth /> },
  { location: '/reports/2', name: 'Rapport 2', icon: icons.tabs.Reporting, renderer: () => 'Report2' },
];

const menu = [
  { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
  { id: 'group-amount-by-month', text: 'Montant par mois de groupes', icon: icons.tabs.Reporting, location: '/reports/group-amount-by-month' },
  { id: 'report2', text: 'Rapport 2', icon: icons.tabs.Reporting, location: '/reports/2' },
];

services.render({
  appIcon: icons.Money,
  appName: 'Money',
  routes,
  menu
});

services.observeStore(io.getOnline, value => {
  if(!value) {
    return;
  }

  const store = services.getStore();
  store.dispatch(referenceInit());
});

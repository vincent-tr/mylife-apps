'use strict';

import { React, services, io } from 'mylife-tools-ui';
import reducers from './reducers';

import { referenceInit } from './actions/reference';

import icons from './components/icons';
import Home from './components/home';
import Management from './components/management';
import GroupByMonth from './components/reporting/group-by-month';

services.initStore(reducers);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
  { location: '/reports/group-by-month', name: 'Groupes par mois', icon: icons.tabs.Reporting, renderer: () => <GroupByMonth /> },
  { location: '/reports/2', name: 'Rapport 2', icon: icons.tabs.Reporting, renderer: () => 'Report2' },
];

const menu = [
  { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
  { id: 'group-by-month', text: 'Groupes par mois', icon: icons.tabs.Reporting, location: '/reports/group-by-month' },
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

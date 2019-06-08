'use strict';

import { React, services } from 'mylife-tools-ui';
import dataService from './services/data-service';
import reducers from './reducers';

import { getAccounts, getGroups } from './actions/common';
import { getOperations } from './actions/management';

import icons from './components/icons';
import Home from './components/home';
import Management from './components/management';
import GroupAbsoluteByMonth from './components/reporting/group-absolute-by-month';

services.initStore(reducers, dataService);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
  { location: '/reports/group-absolute-by-month', name: 'Montant par mois de groupes', icon: icons.tabs.Reporting, renderer: () => <GroupAbsoluteByMonth /> },
  { location: '/reports/2', name: 'Rapport 2', icon: icons.tabs.Reporting, renderer: () => 'Report2' },
];

const menu = [
  { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
  { id: 'group-absolute-by-month', text: 'Montant par mois de groupes', icon: icons.tabs.Reporting, location: '/reports/group-absolute-by-month' },
  { id: 'report2', text: 'Rapport 2', icon: icons.tabs.Reporting, location: '/reports/2' },
];

services.render({
  appIcon: icons.Money,
  appName: 'Money',
  routes,
  menu
});

const store = services.getStore();

store.dispatch(getAccounts());
store.dispatch(getGroups());
store.dispatch(getOperations());

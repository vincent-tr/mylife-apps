'use strict';

import { React, services } from 'mylife-tools-ui';
import dataService from './services/data-service';
import reducers from './reducers';

import { getAccounts, getGroups } from './actions/common';
import { getOperations } from './actions/management';

import icons from './components/icons';
import Management from './components/management';
// import Reporting from './containers/reporting/index-container';

services.initStore(reducers, dataService);

const routes = [
  { location: '/', renderer: () => 'Home' },
  { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
  { location: '/reports/1', name: 'Rapport 1', icon: icons.tabs.Reporting, renderer: () =>'Report1' },
  { location: '/reports/2', name: 'Rapport 2', icon: icons.tabs.Reporting, renderer: () => 'Report2' },
];

const menu = [
  { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
  { id: 'report1', text: 'Rapport 1', icon: icons.tabs.Reporting, location: '/reports/1' },
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

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import { referenceInit } from './reference/actions';

import icons from './common/icons';
import Home from './home/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  // { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
  // { location: '/bots', name: 'Robots', icon: icons.tabs.Bots, renderer: () => <Bots /> },
  // { location: '/reports/group-by-month', name: 'Groupes par mois', icon: icons.tabs.Reporting, renderer: () => <GroupByMonth /> },
  // { location: '/reports/group-by-year', name: 'Groupes par an', icon: icons.tabs.Reporting, renderer: () => <GroupByYear /> },
];

const menu = [
  // { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
  // { id: 'bots', text: 'Robots', icon: icons.tabs.Bots, location: '/bots' },
  // { id: 'group-by-month', text: 'Groupes par mois', icon: icons.tabs.Reporting, location: '/reports/group-by-month' },
  // { id: 'group-by-year', text: 'Groupes par an', icon: icons.tabs.Reporting, location: '/reports/group-by-year' },
];

services.render({
  appIcon: icons.Energy,
  appName: 'Energy',
  routes,
  menu
});

const store = services.getStore();
store.dispatch(referenceInit());

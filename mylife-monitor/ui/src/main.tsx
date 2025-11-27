import React from 'react';
import { services } from 'mylife-tools';
import icons from './common/icons';
import Home from './home/components';
import Nagios from './nagios/components';
import nagiosReducer from './nagios/store';
import Updates from './updates/components';
import updatesReducer from './updates/store';
import Upsmon from './upsmon/components';

const reducers = {
  nagios: nagiosReducer,
  updates: updatesReducer,
};

services.initStore(reducers);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/nagios', name: 'Nagios', icon: icons.menu.Nagios, renderer: () => <Nagios /> },
  { location: '/upsmon', name: 'UPS monitor', icon: icons.menu.Upsmon, renderer: () => <Upsmon /> },
  { location: '/updates', name: 'Updates', icon: icons.menu.Updates, renderer: () => <Updates /> },
];

const menu = [
  { id: 'nagios', text: 'Nagios', icon: icons.menu.Nagios, location: '/nagios' },
  { id: 'upsmon', text: 'UPS monitor', icon: icons.menu.Upsmon, location: '/upsmon' },
  { id: 'updates', text: 'Updates', icon: icons.menu.Updates, location: '/updates' },
];

services.render({
  appIcon: icons.Monitor,
  appName: 'Monitor',
  routes,
  menu,
});

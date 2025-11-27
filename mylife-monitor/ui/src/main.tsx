import React from 'react';
import { services } from 'mylife-tools';
import icons from './common/icons';
import Home from './home/components';
import Nagios from './nagios/components';
import Updates from './updates/components';
import Upsmon from './upsmon/components';
import metadataDefintions from './metadata';
import * as reducers from './reducers';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

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

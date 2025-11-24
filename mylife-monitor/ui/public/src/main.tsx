import React from 'react';
import { services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Nagios from './nagios/components';
import Upsmon from './upsmon/components';
import Updates from './updates/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/nagios', name: 'Nagios', icon: icons.menu.Nagios, renderer: () => <Nagios /> },
  { location: '/upsmon', name: 'UPS monitor', icon: icons.menu.Upsmon, renderer: () => <Upsmon /> },
  { location: '/updates', name: 'Updates', icon: icons.menu.Updates, renderer: () => <Updates /> },
];
/* eslint-enable */

const menu = [
  { id: 'nagios', text: 'Nagios', icon: icons.menu.Nagios, location: '/nagios' },
  { id: 'upsmon', text: 'UPS monitor', icon: icons.menu.Upsmon, location: '/upsmon' },
  { id: 'updates', text: 'Updates', icon: icons.menu.Updates, location: '/updates' },
];

services.render({
  appIcon: icons.Monitor,
  appName: 'Monitor',
  routes,
  menu
});

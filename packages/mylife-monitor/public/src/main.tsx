'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Nagios from './nagios/components';
import Upsmon from './upsmon/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/nagios', name: 'Nagios', icon: icons.menu.Nagios, renderer: () => <Nagios /> },
  { location: '/upsmon', name: 'UPS monitor', icon: icons.menu.Upsmon, renderer: () => <Upsmon /> },
];
/* eslint-enable */

const menu = [
  { id: 'nagios', text: 'Nagios', icon: icons.menu.Nagios, location: '/nagios' },
  { id: 'upsmon', text: 'UPS monitor', icon: icons.menu.Upsmon, location: '/upsmon' },
];

services.render({
  appIcon: icons.Monitor,
  appName: 'Monitor',
  routes,
  menu
});

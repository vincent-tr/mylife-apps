'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
const metadataDefintions = require('../../shared/metadata');

import icons from './common/icons';
import Home from './home/components';
import Nagios from './nagios/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/nagios', name: 'Nagios', icon: icons.menu.Nagios, renderer: () => <Nagios /> },
];
/* eslint-enable */

const menu = [
  { id: 'nagios', text: 'Nagios', icon: icons.menu.Nagios, location: '/nagios' },
];

services.render({
  appIcon: icons.Monitor,
  appName: 'Monitor',
  routes,
  menu
});

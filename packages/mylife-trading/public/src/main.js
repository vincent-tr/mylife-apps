'use strict';

import { React, services, io } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Brokers from './brokers/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/brokers', name: 'Comptes de trading', icon: icons.tabs.Broker, renderer: () => <Brokers /> },
];

const menu = [
  { id: 'brokers', text: 'Comptes de trading', icon: icons.tabs.Broker, location: '/brokers' },
];

services.render({
  appIcon: icons.Trading,
  appName: 'Trading',
  routes,
  menu
});

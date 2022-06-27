'use strict';

import { React, services } from 'mylife-tools-ui';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Brokers from './brokers/components';
import Strategies from './strategies/components';
import Stats from './stats/components';
import Errors from './errors/components';

services.initStore({});
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/brokers', name: 'Comptes de trading', icon: icons.tabs.Broker, renderer: () => <Brokers /> },
  { location: '/strategies', name: 'Stratégies', icon: icons.tabs.Strategy, renderer: () => <Strategies /> },
  { location: '/stats', name: 'Statistiques', icon: icons.tabs.Stat, renderer: () => <Stats /> },
  { location: '/errors', name: 'Erreurs', icon: icons.tabs.Error, renderer: () => <Errors /> },
];

const menu = [
  { id: 'brokers', text: 'Comptes de trading', icon: icons.tabs.Broker, location: '/brokers' },
  { id: 'strategies', text: 'Stratégies', icon: icons.tabs.Strategy, location: '/strategies' },
  { id: 'stats', text: 'Statistiques', icon: icons.tabs.Stat, location: '/stats' },
  { id: 'errors', text: 'Erreurs', icon: icons.tabs.Error, location: '/errors' },
];

services.render({
  appIcon: icons.Trading,
  appName: 'Trading',
  routes,
  menu
});

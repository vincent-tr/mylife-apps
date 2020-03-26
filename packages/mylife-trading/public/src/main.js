'use strict';

import { React, services, io } from 'mylife-tools-ui';
import * as reducers from './reducers';

import icons from './common/icons';
import Home from './home/components';
import Brokers from './brokers/components';

services.initStore(reducers);

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
/*
services.observeStore(io.getOnline, value => {
  if(!value) {
    return;
  }

  const store = services.getStore();
  store.dispatch(referenceInit());
});
*/
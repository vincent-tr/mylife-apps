'use strict';

import { React, services, io } from 'mylife-tools-ui';
import * as reducers from './reducers';

import icons from './common/icons';
import Home from './home/components';

services.initStore(reducers);

const routes = [
  { location: '/', renderer: () => <Home /> },
//  { location: '/management', name: 'Gestion', icon: icons.tabs.Management, renderer: () => <Management /> },
];

const menu = [
//  { id: 'management', text: 'Gestion', icon: icons.tabs.Management, location: '/management' },
];

services.render({
  appIcon: icons.Money,
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
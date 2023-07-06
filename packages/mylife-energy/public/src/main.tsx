import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import { referenceInit } from './reference/actions';

import icons from './common/icons';
import Home from './home/components';
import Live from './live/components';
import Tesla from './tesla/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/live', name: 'Live', icon: icons.tabs.Live, renderer: () => <Live /> },
  { location: '/tesla', name: 'Tesla', icon: icons.tabs.Tesla, renderer: () => <Tesla /> },
];

const menu = [
  { id: 'live', text: 'Live', icon: icons.tabs.Live, location: '/live' },
  { id: 'tesla', text: 'Tesla', icon: icons.tabs.Tesla, location: '/tesla' },
];

services.render({
  appIcon: icons.Energy,
  appName: 'Energy',
  routes,
  menu
});

const store = services.getStore();
store.dispatch(referenceInit());

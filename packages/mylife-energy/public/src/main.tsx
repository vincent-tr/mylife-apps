import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Live from './live/components';
import Tesla from './tesla/components';
import Stats from './stats/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/live', name: 'Live', icon: icons.tabs.Live, renderer: () => <Live /> },
  { location: '/tesla', name: 'Tesla', icon: icons.tabs.Tesla, renderer: () => <Tesla /> },
  { location: '/stats', name: 'Stats', icon: icons.tabs.Stats, renderer: () => <Stats /> },
];

const menu = [
  { id: 'live', text: 'Live', icon: icons.tabs.Live, location: '/live' },
  { id: 'tesla', text: 'Tesla', icon: icons.tabs.Tesla, location: '/tesla' },
  { id: 'stats', text: 'Stats', icon: icons.tabs.Stats, location: '/stats' },
];

services.render({
  appIcon: icons.Energy,
  appName: 'Energy',
  routes,
  menu
});

const store = services.getStore();

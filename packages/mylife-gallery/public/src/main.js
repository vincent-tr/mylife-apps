'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';
import metadataDefintions from '../../shared/metadata';

import icons from './common/icons';
import Home from './home/components';
import Suggestions from './suggestions/components';
import Browse from './browse/components';
import Stats from './stats/components';

services.initStore(reducers);
services.initMetadata(metadataDefintions);

const routes = [
  { location: '/', renderer: () => <Home /> },
  { location: '/suggestions', renderer: () => <Suggestions /> },
  { location: '/browse', renderer: () => <Browse /> },
  { location: '/stats', renderer: () => <Stats /> },
];

const menu = [
  { id: 'suggestions', text: 'Suggestions', icon: icons.menu.Suggestions, location: '/suggestions' },
  { id: 'browse', text: 'Parcourir', icon: icons.menu.Browse, location: '/browse' },
  { id: 'stats', text: 'Statistics', icon: icons.menu.Stats, location: '/stats' },
];

services.render({
  appIcon: icons.Gallery,
  appName: 'Gallery',
  routes,
  menu
});

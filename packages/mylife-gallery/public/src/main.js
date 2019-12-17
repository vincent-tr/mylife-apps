'use strict';

import { React, services, io } from 'mylife-tools-ui';
import * as reducers from './reducers';

// import { referenceInit } from './reference/actions';

import icons from './common/icons';
import Home from './home/components';
import Suggestions from './suggestions/components';
import Browse from './browse/components';
import Stats from './stats/components';

services.initStore(reducers);

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

services.observeStore(io.getOnline, value => {
  if(!value) {
    return;
  }

  const store = services.getStore();
  //store.dispatch(referenceInit());
});

'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';

import icons from './common/icons';
import Home from './home/components';

services.initStore(reducers);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { location: '/:path*', renderer: ({ path }) => <Home path={formatPath(path)} /> },
];
/* eslint-enable */

services.render({
  appIcon: icons.Explorer,
  appName: 'Explorer',
  routes,
});

function formatPath(value) {
  return value.join('/');
}
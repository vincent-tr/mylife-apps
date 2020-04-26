'use strict';

import { React, services } from 'mylife-tools-ui';
import * as reducers from './reducers';

import icons from './common/icons';
import Home from './home/components';
import AdditionalHeader from './home/components/additional-header';
import BreadcrumbItem from './home/components/breadcrumb-item';

services.initStore(reducers);

/* eslint-disable react/display-name, react/prop-types */
const routes = [
  { 
    location: '/:path*', 
    additionalHeader: (<AdditionalHeader />), 
    additionalBreadcrumbRenderer: ({ path }) => renderAdditionalBreadcrumb(path),
    renderer: ({ path }) => (<Home path={formatPath(path)} />)
  },
];
/* eslint-enable */

services.render({
  appIcon: icons.Explorer,
  appName: 'Explorer',
  routes,
});

function formatPath(nodes) {
  return nodes.join('/');
}

function renderAdditionalBreadcrumb(nodes) {
  const path = formatPath(nodes);
  return nodes.map((n, index) => (<BreadcrumbItem key={index} path={path} index={index} />));
}
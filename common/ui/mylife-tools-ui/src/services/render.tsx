'use strict';

import React from 'react';
// React 18
//import { createRoot } from 'react-dom/client';
// React 16
import { render as reactDomRender } from 'react-dom';
import { Application } from '../components/application';

interface RenderOptions {
  containerId?: string;
  container?;
  routes?;
  menu?;
  appName?;
  appIcon?;
  onMainClick?;
  viewName?;
  viewIcon?;
  viewAdditionalHeader?;
  viewAdditionalBreadcrumb?;
}

export function render({
  containerId = 'content',
  container = document.getElementById(containerId),
  ...props
}: RenderOptions = {}) {

  // React 18
  //const root = createRoot(container);
  //root.render(<Application {...props} />);
  // React 16
  reactDomRender(<Application {...props} />, container);
}

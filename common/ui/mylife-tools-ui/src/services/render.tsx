import React from 'react';
import { createRoot } from 'react-dom/client';
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
  const root = createRoot(container);
  root.render(<Application {...props} />);
}

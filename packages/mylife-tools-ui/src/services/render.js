'use strict';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Application } from '../components/application';

export function render({
  containerId = 'content',
  container = document.getElementById(containerId),
  ...props
} = {}) {

  const root = createRoot(container, );
  root.render(<Application {...props} />);
}

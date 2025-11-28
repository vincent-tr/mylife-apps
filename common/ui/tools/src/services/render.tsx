import React from 'react';
import { createRoot } from 'react-dom/client';
import { Application } from '../components/application';

export interface RenderOptions extends React.ComponentProps<typeof Application> {
  containerId?: string;
  container?: HTMLElement;
}

export function render({ containerId = 'content', container = document.getElementById(containerId), ...props }: RenderOptions) {
  const root = createRoot(container);
  root.render(<Application {...props} />);
}

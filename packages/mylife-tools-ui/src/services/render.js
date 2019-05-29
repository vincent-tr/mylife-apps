'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from '../components/application';

export function render({
  containerId = 'content',
  container = document.getElementById(containerId),
  callback,
  ...props
} = {}) {

  ReactDOM.render(
    <Application {...props} />,
    container,
    callback
  );
}

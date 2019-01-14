'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import { Application } from '../components/application';

export function render(element, {
  containerId = 'content',
  container = document.getElementById(containerId),
  callback,
  dialogs = true
} = {}) {

  ReactDOM.render(
    <Application dialogs={dialogs}>
      {element}
    </Application>,
    container,
    callback
  );
}

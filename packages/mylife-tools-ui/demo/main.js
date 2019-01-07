'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { services } from 'mylife-tools-ui';
import * as reducers from './reducers';

services.initStore(reducers);

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

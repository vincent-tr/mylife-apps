'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import './services/store-factory';

import Application from './components/application';

ReactDOM.render(
  <Application/>,
  document.getElementById('content')
);

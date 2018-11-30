'use strict';

import 'normalize.css';
import 'ubuntu-fontface/_ubuntu-base.scss';
import '../src/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../src/components/button';

const App = () => (
  <div>
    <Button primary>primary</Button>
    <Button>secondary</Button>
  </div>
)

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

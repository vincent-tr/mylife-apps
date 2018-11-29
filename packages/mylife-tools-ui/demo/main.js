'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../src/components/button';

import 'normalize.css';

const App = () => (
  <Button>text</Button>
)

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

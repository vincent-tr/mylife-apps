'use strict';

import 'normalize.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../src/components/button';


const App = () => (
  <Button>text</Button>
)

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

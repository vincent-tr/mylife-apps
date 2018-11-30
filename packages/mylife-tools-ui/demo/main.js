'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../src';

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

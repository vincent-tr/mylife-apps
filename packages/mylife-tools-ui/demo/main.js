'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button } from '../src';

const App = () => (
  <Layout appName={'Demo'}
          appIcon={'Icon'}
          viewName={'Components'}
          viewIcon={'compIcon'}
          menu={[{
            id: 'item1',
            text: 'item1',
            icon: null,
            onClick: id => console.log('menu click', id)
          }]}>
    <div>
      <Button primary>primary</Button>
      <Button>secondary</Button>
    </div>
  </Layout>
)

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

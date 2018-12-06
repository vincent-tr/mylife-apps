'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button } from '../src';
import icon from './icon.ico';

const App = () => (
  <Layout appName={<h1>Demo</h1>}
          appIcon={<img src={icon} style={{objectFit: 'scale-down', height: '100%', width: '100%'}}/>}
          viewName={'Components'}
          viewIcon={'Icon'}
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

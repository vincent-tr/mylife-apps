'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button } from '../src';
import icon from './icon.ico';

const App = () => (
  <Layout logoName={<h1>Demo</h1>}
          logoIcon={<img src={icon} style={{objectFit: 'scale-down', height: '100%', width: '100%'}}/>}
          logoOnClick={() => console.log('onLogoClick')}
          viewName={<h2>Components</h2>}
          viewIcon={<img src={icon} style={{objectFit: 'scale-down', height: '100%', width: '100%'}}/>}
          menu={[{
            id: 'item1',
            text: 'item1',
            icon: null,
            onClick: id => console.log('menu click', id)
          }]}
          footer={'footer'}>
    <div>
      <Button primary>primary</Button>
      <Button>secondary</Button>
      <Button disabled primary>disabled primary</Button>
      <Button disabled>disabled secondary</Button>
    </div>
  </Layout>
)

ReactDOM.render(
  <App/>,
  document.getElementById('content')
);

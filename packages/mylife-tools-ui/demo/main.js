'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button, Icon } from '../src';
import icon from './icon.ico';

const App = () => (
  <Layout logoName={<h1>Demo</h1>}
          logoIcon={<Icon src={icon}/>}
          logoOnClick={() => console.log('onLogoClick')}
          viewName={<h2>Components</h2>}
          viewIcon={<Icon src={icon}/>}
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

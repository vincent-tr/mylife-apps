'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Button, Icon } from '../src';
import icon from './icon.ico';

const menuClick = id => console.log('menu click', id);
const menu = [
  { id: 'header1', text: 'Header 1', icon: null, type: 'header' },
  { id: 'item11', text: 'Item 1.1', icon: <Icon src={icon}/>, type: 'item', onClick: menuClick },
  { id: 'item12', text: 'Item 1.2', icon: <Icon src={icon}/>, type: 'item', onClick: menuClick },
  { id: 'header2', text: 'Header 2', icon: <Icon src={icon}/>, type: 'header', onClick: menuClick },
  { id: 'item21', text: 'Item 2.1', icon: null, type: 'item', onClick: menuClick },
  { id: 'item22', text: 'Item 2.2', icon: null, type: 'item', onClick: menuClick },
];

const App = () => (
  <Layout logoName={<h1>Demo</h1>}
          logoIcon={<Icon src={icon}/>}
          logoOnClick={() => console.log('onLogoClick')}
          viewName={<h2>Components</h2>}
          viewIcon={<Icon src={icon}/>}
          menu={menu}
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

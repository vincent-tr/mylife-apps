'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { components } from '../../src';
import icon from '../icon.ico';

const menuClick = id => console.log('menu click', id);
const menu = [
  { id: 'header1', text: 'Header 1', icon: null, type: 'header' },
  { id: 'item11', text: 'Item 1.1', icon: <components.Icon src={icon}/>, type: 'item', onClick: menuClick },
  { id: 'item12', text: 'Item 1.2', icon: <components.Icon src={icon}/>, type: 'item', onClick: menuClick },
  { id: 'header2', text: 'Header 2', icon: <components.Icon src={icon}/>, type: 'header', onClick: menuClick },
  { id: 'item21', text: 'Item 2.1', icon: null, type: 'item', onClick: menuClick },
  { id: 'item22', text: 'Item 2.2', icon: null, type: 'item', onClick: menuClick },
];

const Layout = ({ viewName, viewIcon, children }) => (
  <components.Layout logoName={<h1>Demo</h1>}
    logoIcon={<components.Icon src={icon}/>}
    logoOnClick={() => console.log('onLogoClick')}
    viewName={<h2>{viewName}</h2>}
    viewIcon={<components.Icon src={viewIcon}/>}
    menu={menu}
    footer={'footer'}>
    {children}
  </components.Layout>
);

Layout.propTypes = {
  viewName: PropTypes.string.isRequired,
  viewIcon: PropTypes.string.isRequired,
  children: components.Layout.propTypes.children
};

export default Layout;
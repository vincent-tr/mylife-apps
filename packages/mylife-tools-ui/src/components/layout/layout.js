'use strict';

import React from 'react';

import Logo from './logo';
import Header from './header';
import Footer from './footer';
import Menu from './menu';
import Content from './content';
import Container from './container';

const Layout = ({ appIcon, appName, viewIcon, viewName, menu, children, footer }) => (
  <Container>
  <Logo icon={appIcon} name={appName} />
    <Header icon={viewIcon} name={viewName} />
    <Menu items={menu} />
    <Content>
      {children}
    </Content>
    <Footer>
      {footer}
    </Footer>
  </Container>
);

Layout.propTypes = {
  appIcon  : Header.propTypes.appIcon,
  appName  : Header.propTypes.appName,
  viewIcon : Header.propTypes.viewIcon,
  viewName : Header.propTypes.viewName,
  menu     : Menu.propTypes.items,
  children : Content.propTypes.children,
  footer   : Footer.propTypes.children,
};

export default Layout;
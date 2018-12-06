'use strict';

import React from 'react';

import Header from './header';
import Footer from './footer';
import Menu from './menu';
import Content from './content';
import Container from './container';

const Layout = ({ appIcon, appName, viewIcon, viewName, menu, children }) => (
  <Container>
    <Header appIcon={appIcon} appName={appName} viewIcon={viewIcon} viewName={viewName} />
    <Menu items={menu} />
    <Content>
      {children}
    </Content>
    <Footer />
  </Container>
);

Layout.propTypes = {
  appIcon  : Header.propTypes.appIcon,
  appName  : Header.propTypes.appName,
  viewIcon : Header.propTypes.viewIcon,
  viewName : Header.propTypes.viewName,
  menu     : Menu.propTypes.items,
  children : Content.propTypes.children,
};

export default Layout;
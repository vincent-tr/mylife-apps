'use strict';

import React from 'react';

import Logo from './logo';
import Header from './header';
import Footer from './footer';
import Menu from './menu';
import Content from './content';
import Container from './container';

const Layout = ({ logoIcon, logoName, viewIcon, viewName, menu, children, footer, logoOnClick }) => (
  <Container>
  <Logo icon={logoIcon} name={logoName} onClick={logoOnClick} />
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
  logoIcon    : Logo.propTypes.icon,
  logoName    : Logo.propTypes.name,
  viewIcon    : Header.propTypes.icon,
  viewName    : Header.propTypes.name,
  menu        : Menu.propTypes.items,
  children    : Content.propTypes.children,
  footer      : Footer.propTypes.children,
  logoOnClick : Logo.propTypes.onClick
};

export default Layout;
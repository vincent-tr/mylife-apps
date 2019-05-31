'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import Header from './header';
import Menu from './menu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  }
}));

const Layout = ({ appName, appIcon, onMainClick, viewName, viewIcon, menu, children }) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div className={classes.root}>

      <Header
        onMenuButtonClick={menu && (() => setMenuOpen(!menuOpen))}
        appName={appName}
        appIcon={appIcon}
        onMainClick={onMainClick}
        viewName={viewName}
        viewIcon={viewIcon}
        className={classes.appBar} />

      {menu && (
        <Menu items={menu} open={menuOpen} />
      )}

      <main className={classes.content}>
        {children}
      </main>

    </div>
  );
};

Layout.propTypes = {
  appName: Header.propTypes.appName,
  appIcon: Header.propTypes.appIcon,
  onMainClick: PropTypes.func,
  viewName: Header.propTypes.viewName,
  viewIcon: Header.propTypes.viewIcon,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  menu: Menu.propTypes.items
};

export default Layout;

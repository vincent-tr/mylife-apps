'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

import { useScreenSize } from '../behaviors';
import Header from './header';
import Menu from './menu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    width: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
    flex: '0 0 auto'
  },
}));

const menuStates = {
  HIDE: 0,
  REDUCED: 1,
  VISIBLE: 2
};

const initialMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: menuStates.VISIBLE
};

const afterSelectMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: null // = unchanged
};

const hideValueMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: menuStates.REDUCED
};

const Layout = ({ appName, appIcon, onMainClick, viewName, viewIcon, menu, children }) => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const [menuState, setMenuState] = useState(initialMenuState[screenSize]);

  const menuSelect = () => {
    const state = afterSelectMenuState[screenSize];
    if(state !== null) {
      setMenuState(state);
    }
  };

  const menuButtonClick = () => {
    const hideValue = hideValueMenuState[screenSize];
    setMenuState(menuState === menuStates.VISIBLE ? hideValue : menuStates.VISIBLE);
  };

  return (
    <div className={classes.root}>

      <Header
        onMenuButtonClick={menu && menuButtonClick}
        appName={appName}
        appIcon={appIcon}
        onMainClick={onMainClick}
        viewName={viewName}
        viewIcon={viewIcon}
        className={classes.appBar} />

      {menu && menuState !== menuStates.HIDE && (
        <Menu items={menu} open={menuState === menuStates.VISIBLE} onSelect={menuSelect} />
      )}

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
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

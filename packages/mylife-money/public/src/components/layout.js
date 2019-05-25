'use strict';

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, AppBar, Toolbar, Typography, Drawer, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, Breadcrumbs, Link } from '@material-ui/core';
import icons from './icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';

import Management from './management/index';
import ReportingContainer from '../containers/reporting/index-container';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  titleIcon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  titleLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const Layout = () => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(true);
  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar, menuOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge='start' color='inherit' aria-label='Open drawer' onClick={() => setMenuOpen(true)} className={clsx(classes.menuButton, menuOpen && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
          <Breadcrumbs aria-label="Breadcrumb" variant="h5" color='inherit' >
            <Link color='inherit' href='/' className={classes.titleLink} onClick={() => console.log('click')}>
              <HomeIcon className={classes.titleIcon} />
              MyLife Money
            </Link>
            <Typography color='inherit' className={classes.titleLink}>
              <icons.tabs.Management className={classes.titleIcon} />
              Management
            </Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>

      <Drawer variant='permanent' open={menuOpen} classes={{paper: clsx(classes.drawerPaper, !menuOpen && classes.drawerPaperClose)}}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => setMenuOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon><icons.tabs.Management /></ListItemIcon>
            <ListItemText primary="Management" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><icons.tabs.Reporting /></ListItemIcon>
            <ListItemText primary="Report 1" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><icons.tabs.Reporting /></ListItemIcon>
            <ListItemText primary="Report 2" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
      </main>
    </div>
  );
};

export default Layout;

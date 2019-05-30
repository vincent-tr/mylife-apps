'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, AppBar, Toolbar, Typography, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Breadcrumbs, Link, SvgIcon } from '@material-ui/core';
import * as icons from '@material-ui/icons';

const {
  Menu: MenuIcon,
  NavigateNext: NavigateNextIcon,
} = icons;

import ManagementIcon from '@material-ui/icons/FormatListBulleted';
import ReportingIcon from '@material-ui/icons/ShowChart';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  breadcrumbList: {
    flexWrap: 'nowrap'
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: theme.spacing(4),
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

const Layout = ({ appName, appIcon }) => {
  const AppIcon = appIcon;
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(true);
  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={classes.appBar}>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='Open drawer' onClick={() => setMenuOpen(!menuOpen)} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Breadcrumbs aria-label="Breadcrumb" color='inherit' separator={<NavigateNextIcon fontSize='small' />} classes={{ ol: classes.breadcrumbList }}>
            <Link color='inherit' component='button' variant='h6' className={classes.titleLink} onClick={() => console.log('click')} noWrap>
              <AppIcon className={classes.titleIcon} />
              {appName}
            </Link>
            <Typography color='inherit' variant='h6' className={classes.titleLink} noWrap>
              <ManagementIcon className={classes.titleIcon} />
              Gestion
            </Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>

      <Drawer variant='permanent' open={menuOpen} classes={{paper: clsx(classes.drawerPaper, !menuOpen && classes.drawerPaperClose)}}>
        <div className={classes.drawerHeader} />
        <List>
          <ListItem button>
            <ListItemIcon><ManagementIcon /></ListItemIcon>
            <ListItemText primary="Gestion" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><ReportingIcon /></ListItemIcon>
            <ListItemText primary="Rapport 1" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><ReportingIcon /></ListItemIcon>
            <ListItemText primary="Rapport 2" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
      </main>
    </div>
  );
};

Layout.propTypes = {
  appName: PropTypes.string.isRequired,
  appIcon: PropTypes.func.isRequired
};

export default Layout;

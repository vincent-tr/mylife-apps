'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, AppBar, Toolbar, Typography, IconButton, Breadcrumbs, Link } from '@material-ui/core';
import * as icons from '@material-ui/icons';

const {
  Menu: MenuIcon,
  NavigateNext: NavigateNextIcon,
} = icons;

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(4),
  },
  breadcrumbs: {
    overflowX: 'auto'
  },
  breadcrumbList: {
    flexWrap: 'nowrap'
  },
  pad: {
    flexGrow: 1,
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

const Header = ({ appName, appIcon, onMainClick, viewName, viewIcon, viewAdditionalHeader, viewAdditionalBreadcrumb, onMenuButtonClick, ...props }) => {
  const AppIcon = appIcon;
  const ViewIcon = viewIcon;
  const classes = useStyles();

  return (
    <AppBar position='absolute' {...props}>
      <Toolbar>
        {onMenuButtonClick && (
          <IconButton edge='start' color='inherit' aria-label='Open drawer' onClick={onMenuButtonClick} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
        )}
        <Breadcrumbs aria-label="Breadcrumb" color='inherit' separator={<NavigateNextIcon fontSize='small' />} classes={{ root: classes.breadcrumbs, ol: classes.breadcrumbList }}>
          <Link color='inherit' component='button' variant='h6' className={classes.titleLink} onClick={onMainClick} noWrap>
            <AppIcon className={classes.titleIcon} />
            {appName}
          </Link>
          {viewName && (
            <Typography color='inherit' variant='h6' className={classes.titleLink} noWrap>
              <ViewIcon className={classes.titleIcon} />
              {viewName}
            </Typography>
          )}
          {viewAdditionalBreadcrumb}
        </Breadcrumbs>

        <div className={classes.pad} />

        {viewAdditionalHeader}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  appName: PropTypes.string.isRequired,
  appIcon: PropTypes.elementType.isRequired,
  onMainClick: PropTypes.func,
  viewName: PropTypes.node,
  viewIcon: PropTypes.elementType,
  viewAdditionalHeader: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  viewAdditionalBreadcrumb: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  onMenuButtonClick: PropTypes.func
};

export default Header;

'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root : {
    position      : 'absolute',
    top           : 0,
    bottom        : 0,
    left          : 0,
    right         : 0,
    display       : 'flex',
    flexDirection : 'column',
    overflow      : 'hidden'
  },
  flex : {
    flexGrow : 1
  },
  container : {
    overflowY : 'auto',
    position  : 'relative',
    height    : '100%',
    width     :  '100%',
  }
});

const Layout = ({ classes, title, onClose, children }) => (
  <div className={classes.root}>
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='title' color='inherit' className={classes.flex}>
          {title}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} color='inherit'>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
    <div className={classes.container}>
      {children}
    </div>
  </div>
);

Layout.propTypes = {
  classes  : PropTypes.object.isRequired,
  title    : PropTypes.string.isRequired,
  onClose  : PropTypes.func,
  children : PropTypes.node,
};

export default withStyles(styles)(Layout);


'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawerHeader: theme.mixins.toolbar,
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
  }
}));

const Menu = ({ items, open }) => {
  const classes = useStyles();

  return (
    <Drawer variant='permanent' open={open} classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}}>
      <div className={classes.drawerHeader} />
      <List>
        {items.map(({ id, text, icon: Icon, onClick }) => (
          <ListItem button key={id} onClick={onClick}>
            <ListItemIcon><Icon /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id      : PropTypes.string.isRequired,
      text    : PropTypes.node.isRequired,
      icon    : PropTypes.elementType,
      onClick : PropTypes.func
    }).isRequired
  ),
  open: PropTypes.bool.isRequired
};

export default Menu;

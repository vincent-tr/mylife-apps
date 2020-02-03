'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useScreen } from '../behaviors/responsive';

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

const Menu = ({ items, open, onSelect }) => {
  const classes = useStyles();
  const reponsiveItems = useResponsiveItems(items);

  return (
    <Drawer variant='permanent' open={open} classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}}>
      <div className={classes.drawerHeader} />
      <List>
        {reponsiveItems.map(({ id, text, icon: Icon, onClick }) => {
          const handler = () => {
            onSelect();
            onClick();
          };
          return (
            <ListItem button key={id} onClick={handler}>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
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
  open: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default Menu;

function useResponsiveItems(items) {
  const { size, orientation } = useScreen();

  return items.filter(item => {
    const { sizes, orientations } = item.responsive || {};
    return isIn(sizes, size) && isIn(orientations, orientation);
  });
}

function isIn(values, current) {
  if(!values) {
    return true; // no filter if not provided
  }

  return values.includes(current);
}

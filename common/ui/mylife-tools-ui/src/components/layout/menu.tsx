import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useScreen } from '../behaviors/responsive';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(open === false && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    }),
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Menu = ({ items, open, onSelect }) => {
  const reponsiveItems = useResponsiveItems(items);

  return (
    <StyledDrawer variant='permanent' open={open}>
      <DrawerHeader />
      <List>
        {reponsiveItems.map(({ id, text, icon: Icon, onClick }) => {
          const handler = () => {
            onSelect();
            onClick();
          };
          return (
            <ListItem key={id} onClick={handler} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </StyledDrawer>
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

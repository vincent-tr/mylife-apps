import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import React from 'react';
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

export interface MenuItem {
  id: string;
  text: React.ReactNode;
  icon?: React.ElementType;
  onClick?: () => void;
  responsive?: {
    sizes?: ('phone' | 'tablet' | 'laptop' | 'wide')[];
    orientations?: ('portrait' | 'landscape')[];
  };
}

export interface MenuProps {
  items: MenuItem[];
  open: boolean;
  onSelect: () => void;
}

export default function Menu({ items, open, onSelect }: MenuProps) {
  const reponsiveItems = useResponsiveItems(items);

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader />
      <List>
        {reponsiveItems.map(({ id, text, icon: Icon, onClick }) => {
          const handler = () => {
            onSelect();
            onClick();
          };
          return (
            <ListItem key={id} onClick={handler} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </StyledDrawer>
  );
}

function useResponsiveItems(items) {
  const { size, orientation } = useScreen();

  return items.filter((item) => {
    const { sizes, orientations } = item.responsive || {};
    return isIn(sizes, size) && isIn(orientations, orientation);
  });
}

function isIn(values, current) {
  if (!values) {
    return true; // no filter if not provided
  }

  return values.includes(current);
}

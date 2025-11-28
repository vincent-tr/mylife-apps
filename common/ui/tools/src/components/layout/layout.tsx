import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useScreenSize } from '../behaviors';
import Header from './header';
import Menu, { MenuItem } from './menu';

const Root = styled(Box)({
  display: 'flex',
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
});

const StyledHeader = styled(Header)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Content = styled('main')({
  flexGrow: 1,
  width: 0,
  height: '100dvh',
  '@supports not (height: 100dvh)': {
    height: '100vh',
  },
  display: 'flex',
  flexDirection: 'column',
});

const AppBarSpacer = styled(Box)(({ theme }) => ({
  ...theme.mixins.toolbar,
  flex: '0 0 auto',
}));

const menuStates = {
  HIDE: 0,
  REDUCED: 1,
  VISIBLE: 2,
};

const initialMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: menuStates.VISIBLE,
};

const afterSelectMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: null, // = unchanged
};

const hideValueMenuState = {
  phone: menuStates.HIDE,
  tablet: menuStates.HIDE,
  laptop: menuStates.REDUCED,
  wide: menuStates.REDUCED,
};

export interface LayoutProps {
  appName: string;
  appIcon: React.ElementType;
  onMainClick?: () => void;
  viewName?: React.ReactNode;
  viewIcon?: React.ElementType;
  viewAdditionalHeader?: React.ReactNode;
  viewAdditionalBreadcrumb?: React.ReactNode;
  children?: React.ReactNode;
  menu?: MenuItem[];
}

export default function Layout({ appName, appIcon, onMainClick, viewName, viewIcon, viewAdditionalHeader, viewAdditionalBreadcrumb, menu, children }: LayoutProps) {
  const screenSize = useScreenSize();
  const [menuState, setMenuState] = useState(initialMenuState[screenSize]);
  useEffect(() => setMenuState(initialMenuState[screenSize]), [screenSize]);

  const menuSelect = () => {
    const state = afterSelectMenuState[screenSize];
    if (state !== null) {
      setMenuState(state);
    }
  };

  const menuButtonClick = () => {
    const hideValue = hideValueMenuState[screenSize];
    setMenuState(menuState === menuStates.VISIBLE ? hideValue : menuStates.VISIBLE);
  };

  return (
    <Root>
      <StyledHeader
        onMenuButtonClick={menu && menuButtonClick}
        appName={appName}
        appIcon={appIcon}
        onMainClick={onMainClick}
        viewName={viewName}
        viewAdditionalHeader={viewAdditionalHeader}
        viewAdditionalBreadcrumb={viewAdditionalBreadcrumb}
        viewIcon={viewIcon}
      />

      {menu && menuState !== menuStates.HIDE && <Menu items={menu} open={menuState === menuStates.VISIBLE} onSelect={menuSelect} />}

      <Content>
        <AppBarSpacer />
        {children}
      </Content>
    </Root>
  );
}

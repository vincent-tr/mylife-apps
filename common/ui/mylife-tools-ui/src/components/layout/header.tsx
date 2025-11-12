import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, Toolbar, Typography, IconButton, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as icons from '@mui/icons-material';

const {
  Menu: MenuIcon,
  NavigateNext: NavigateNextIcon,
} = icons;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  overflowX: 'auto',
  '& .MuiBreadcrumbs-ol': {
    flexWrap: 'nowrap'
  }
}));

const PadDiv = styled('div')({
  flexGrow: 1,
});

const TitleIcon = styled('svg')(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  width: 20,
  height: 20,
}));

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}) as typeof Link;

const StyledTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const Header = ({ appName, appIcon, onMainClick, viewName, viewIcon, viewAdditionalHeader, viewAdditionalBreadcrumb, onMenuButtonClick, ...props }) => {
  const AppIcon = appIcon;
  const ViewIcon = viewIcon;

  return (
    <AppBar position='absolute' {...props}>
      <Toolbar>
        {onMenuButtonClick && (
          <StyledIconButton edge='start' color='inherit' aria-label='Open drawer' onClick={onMenuButtonClick}>
            <MenuIcon />
          </StyledIconButton>
        )}
        <StyledBreadcrumbs aria-label="Breadcrumb" color='inherit' separator={<NavigateNextIcon fontSize='small' />}>
          <StyledLink color='inherit' component='button' variant='h6' onClick={onMainClick} noWrap>
            <TitleIcon as={AppIcon} />
            {appName}
          </StyledLink>
          {viewName && (
            <StyledTypography color='inherit' variant='h6' noWrap>
              <TitleIcon as={ViewIcon} />
              {viewName}
            </StyledTypography>
          )}
          {viewAdditionalBreadcrumb}
        </StyledBreadcrumbs>

        <PadDiv />

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

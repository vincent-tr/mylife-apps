import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AppBar from '@mui/material/AppBar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const StyledBreadcrumbs = styled(Breadcrumbs)({
  overflowX: 'auto',
  '& .MuiBreadcrumbs-ol': {
    flexWrap: 'nowrap',
  },
});

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
  justifyContent: 'center',
}) as typeof Link;

const StyledTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export interface HeaderProps extends React.ComponentProps<typeof AppBar> {
  appName: string;
  appIcon: React.ElementType;
  onMainClick?: () => void;
  viewName?: React.ReactNode;
  viewIcon?: React.ElementType;
  viewAdditionalHeader?: React.ReactNode;
  viewAdditionalBreadcrumb?: React.ReactNode;
  onMenuButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ appName, appIcon, onMainClick, viewName, viewIcon, viewAdditionalHeader, viewAdditionalBreadcrumb, onMenuButtonClick, ...props }) => {
  const AppIcon = appIcon;
  const ViewIcon = viewIcon;

  return (
    <AppBar position="absolute" {...props}>
      <Toolbar>
        {onMenuButtonClick && (
          <StyledIconButton edge="start" color="inherit" aria-label="Open drawer" onClick={onMenuButtonClick}>
            <MenuIcon />
          </StyledIconButton>
        )}
        <StyledBreadcrumbs aria-label="Breadcrumb" color="inherit" separator={<NavigateNextIcon fontSize="small" />}>
          <StyledLink color="inherit" component="button" variant="h6" onClick={onMainClick} noWrap>
            <TitleIcon as={AppIcon} />
            {appName}
          </StyledLink>
          {viewName && (
            <StyledTypography color="inherit" variant="h6" noWrap>
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

export default Header;

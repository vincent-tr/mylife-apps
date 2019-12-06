'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../icons';

const useStyles = mui.makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const NavBar = ({ document, info, onClose, onInfo, ...props }) => {
  const classes = useStyles();
  return (
    <mui.AppBar {...props}>
      <mui.Toolbar>
        <mui.IconButton edge='start' color='inherit' onClick={onClose}>
          <icons.actions.Close />
        </mui.IconButton>
        <mui.Typography variant='h6' className={classes.title}>
          {info.title}
        </mui.Typography>
        <mui.IconButton color='inherit' onClick={() => console.log('DOWNLOAD')}>
          <icons.actions.Download />
        </mui.IconButton>
        <mui.IconButton edge='end' color='inherit' onClick={onInfo}>
          <icons.actions.Detail />
        </mui.IconButton>
      </mui.Toolbar>
    </mui.AppBar>
  );
};

NavBar.propTypes = {
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onInfo: PropTypes.func.isRequired,
};

export default NavBar;

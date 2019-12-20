'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../icons';

const useStyles = mui.makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const NavBar = ({ document, info, showDetail, onClose, onDetail, ...props }) => {
  void document;
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
        {showDetail && (
          <mui.IconButton color='inherit' onClick={onDetail}>
            <icons.actions.Detail />
          </mui.IconButton>
        )}
        <mui.IconButton edge='end' color='inherit' component={mui.Link} download={info.downloadFilename} href={info.downloadUrl}>
          <icons.actions.Download />
        </mui.IconButton>
      </mui.Toolbar>
    </mui.AppBar>
  );
};

NavBar.propTypes = {
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  showDetail: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDetail: PropTypes.func,
};

export default NavBar;

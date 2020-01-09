'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import FullScreenDialog from '../../../common/fullscreen-dialog';
import icons from '../../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const DialogBase = ({ show, onClose, title, children, ...props }) => {
  const classes = useStyles();

  return (
    <FullScreenDialog open={show}>
      <mui.AppBar className={classes.appBar}>
        <mui.Toolbar>
          <mui.IconButton edge='start' color='inherit' onClick={onClose}>
            <icons.actions.Close />
          </mui.IconButton>
          <mui.Typography variant='h6' className={classes.title}>
            {title}
          </mui.Typography>
        </mui.Toolbar>
      </mui.AppBar>
      <mui.DialogContent {...props}>
        {children}
      </mui.DialogContent>
    </FullScreenDialog>
  );
};

DialogBase.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default DialogBase;

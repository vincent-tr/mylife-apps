'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../icons';
import * as utils from './utils';

const useStyles = mui.makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <mui.Slide direction='up' ref={ref} {...props} />;
});

const Dialog = ({ show, proceed, options }) => {
  const classes = useStyles();
  const { document } = options;
  const info = utils.getInfo(document);

  return (
    <mui.Dialog open={show} onClose={proceed} fullScreen TransitionComponent={Transition}>
      <mui.AppBar className={classes.appBar}>
        <mui.Toolbar>
          <mui.IconButton edge='start' color='inherit' onClick={proceed} aria-label='close'>
            <icons.actions.Close />
          </mui.IconButton>
          <mui.Typography variant='h6' className={classes.title}>
            {info.title}
          </mui.Typography>
          <mui.IconButton color='inherit' onClick={proceed} aria-label='close'>
            <icons.actions.Download />
          </mui.IconButton>
          <mui.IconButton edge='end' color='inherit' onClick={proceed} aria-label='close'>
            <icons.actions.Detail />
          </mui.IconButton>
        </mui.Toolbar>
      </mui.AppBar>
      <mui.DialogTitle disableTypography>
        <mui.Typography variant='h6' color='error'>
          {'Erreur'}
        </mui.Typography>
      </mui.DialogTitle>
      <mui.DialogContent>
        <mui.DialogContentText id='alert-dialog-description'>
          {JSON.stringify(document)}
        </mui.DialogContentText>
      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={proceed} color='primary' autoFocus>
          Close
        </mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

Dialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

export default Dialog;

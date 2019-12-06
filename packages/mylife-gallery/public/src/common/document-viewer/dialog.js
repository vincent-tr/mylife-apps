'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const Dialog = ({ show, proceed, options }) => {
  const { document } = options;
  return (
    <mui.Dialog open={show} onClose={proceed} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' fullWidth maxWidth='sm'>
      <mui.DialogTitle id='alert-dialog-title' disableTypography>
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

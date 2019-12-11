'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';

const DialogError = ({ error, onClose }) => (
  <mui.Dialog
    title="Erreur !"
    actions={<mui.FlatButton
              label="OK"
              primary={true}
              onTouchTap={onClose} />}
    modal={true}
    open={!!error}>
    <div style={{whiteSpace: 'pre'}}>
      {error && error.toString()}
    </div>
  </mui.Dialog>
);

DialogError.propTypes = {
  error: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default DialogError;
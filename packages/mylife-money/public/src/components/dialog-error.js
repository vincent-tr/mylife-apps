'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

const DialogError = ({ error, onClose }) => (
  <mui.Dialog
    title="Erreur !"
    actions={<mui.Button primary onClick={onClose} >OK</mui.Button>}
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

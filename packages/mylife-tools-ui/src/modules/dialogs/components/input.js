'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';

const Confirm = ({ show, proceed, options }) => {
  const [text, setText] = useState(options.text);
  return (
    <Dialog aria-labelledby='dialog-title' open={show} scroll='paper' maxWidth='sm' fullWidth>
      {options.title && (
        <DialogTitle id='dialog-title'>
          {options.title}
        </DialogTitle>
      )}

      <DialogContent dividers>
        {options.message && (
          <DialogContentText>
            {options.message}
          </DialogContentText>
        )}
        <TextField autoFocus fullWidth label={options.label} id='text' value={text || ''} onChange={e => setText(e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button color='primary' onClick={() => proceed({ result: 'ok', text })}>OK</Button>
        <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

Confirm.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

export default Confirm;

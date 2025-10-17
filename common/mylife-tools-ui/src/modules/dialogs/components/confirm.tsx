'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const Confirm = ({ show, proceed, options }) => (
  <Dialog aria-labelledby='dialog-title' open={show} scroll='paper'>
    {options.title && (
      <DialogTitle id='dialog-title'>
        {options.title}
      </DialogTitle>
    )}
    {options.message && (
      <DialogContent dividers>
        <DialogContentText>
          {options.message}
        </DialogContentText>
      </DialogContent>
    )}
    <DialogActions>
      {options.actions.map(({ text, value, ...props }, index) => (
        <Button key={index} color='primary' {...props} onClick={() => proceed(value)}>
          {text}
        </Button>
      ))}
    </DialogActions>
  </Dialog>
);

Confirm.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

export default Confirm;

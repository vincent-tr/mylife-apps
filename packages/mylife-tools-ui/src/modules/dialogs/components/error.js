'use strict';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Button } from '@material-ui/core';
import { getError } from '../selectors';
import { errorClear } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      error: getError(state)
    })),
    ...useMemo(() => ({
      clear : () => dispatch(errorClear())
    }), [dispatch])
  };
};

const Error = () => {
  const { error, clear } = useConnect();
  return (
    <Dialog open={!!error} onClose={clear} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description' fullWidth maxWidth='sm'>
      <DialogTitle id='alert-dialog-title' disableTypography><Typography variant='h6' color='error'>{'Erreur'}</Typography></DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {error && error.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear} color='primary' autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Error;

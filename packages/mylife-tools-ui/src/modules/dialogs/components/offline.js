'use strict';

import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Dialog, DialogTitle, Typography, CircularProgress } from '@material-ui/core';
import { getOnline } from '../../io/selectors';

const useConnect = () => {
  return useSelector(state => ({
    online : getOnline(state),
  }));
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  progress: {
    marginRight: theme.spacing(2),
  }
}));

const Busy = () => {
  const { online } = useConnect();
  const classes = useStyles();
  return (
    <Dialog disableBackdropClick disableEscapeKeyDown open={!online} aria-labelledby='alert-dialog-title'>
      <DialogTitle id='alert-dialog-title' disableTypography>
        <Typography variant='h6' className={classes.container}>
          <CircularProgress color='inherit' className={classes.progress} />
          {'Reconnexion en cours ...'}
        </Typography>
      </DialogTitle>
    </Dialog>
  );
};

export default Busy;

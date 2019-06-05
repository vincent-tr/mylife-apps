'use strict';

import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle } from '@material-ui/core';
import { getBusy } from '../selectors';

const useConnect = () => {
  return useSelector(state => ({
    busy : getBusy(state),
  }));
};

const Busy = () => {
  const { busy } = useConnect();
  return (
    <Dialog disableBackdropClick disableEscapeKeyDown open={busy} aria-labelledby='alert-dialog-title'>
      <DialogTitle id='alert-dialog-title'>{'Traitement en cours ...'}</DialogTitle>
    </Dialog>
  );
};

export default Busy;

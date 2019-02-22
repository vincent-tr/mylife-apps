'use strict';

import React from 'react';
import Dialog from './dialog';
import { Spinner } from '../../../components';
import { getBusy } from '../selectors';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => ({
    busy : getBusy(state),
  })
);

const Busy = () => {
  const { busy } = useConnect();
  return (
    <Dialog open={busy} className='dialog-busy'>
      <Spinner className='busy-icon' />
      <span className='busy-text'>Traitement en cours ...</span>
    </Dialog>
  );
};

export default Busy;

import React from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import { getBusy } from '../store';

const useConnect = () => ({
  busy: useSelector(getBusy),
});

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center'
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Busy: React.FC = () => {
  const { busy } = useConnect();
  return (
    <Dialog open={busy} aria-labelledby='alert-dialog-title'>
      <StyledDialogTitle id='alert-dialog-title' variant='h6'>
        <Progress color='inherit' />
        {'Traitement en cours ...'}
      </StyledDialogTitle>
    </Dialog>
  );
};

export default Busy;

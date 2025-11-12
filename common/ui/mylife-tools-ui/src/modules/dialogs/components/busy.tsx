import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getBusy } from '../selectors';

const useConnect = () => {
  return useSelector(state => ({
    busy : getBusy(state),
  }));
};

const Container = styled(Typography)({
  display: 'flex',
  alignItems: 'center'
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Busy = () => {
  const { busy } = useConnect();
  return (
    <Dialog open={busy} aria-labelledby='alert-dialog-title'>
      <DialogTitle id='alert-dialog-title'>
        <Container variant='h6'>
          <Progress color='inherit' />
          {'Traitement en cours ...'}
        </Container>
      </DialogTitle>
    </Dialog>
  );
};

export default Busy;

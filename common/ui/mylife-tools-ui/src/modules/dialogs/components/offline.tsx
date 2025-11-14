import React from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import { getOnline } from '../../io/selectors';

const useConnect = () => ({
  online: useSelector(getOnline),
});

const Container = styled(Typography)({
  display: 'flex',
  alignItems: 'center'
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Busy = () => {
  const { online } = useConnect();
  return (
    <Dialog open={!online} aria-labelledby='alert-dialog-title'>
      <DialogTitle id='alert-dialog-title'>
        <Container variant='h6'>
          <Progress color='inherit' />
          {'Reconnexion en cours ...'}
        </Container>
      </DialogTitle>
    </Dialog>
  );
};

export default Busy;

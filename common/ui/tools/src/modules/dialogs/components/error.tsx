import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, getError } from '../store';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    error: useSelector(getError),
    ...useMemo(
      () => ({
        clear: () => dispatch(clearError()),
      }),
      [dispatch]
    ),
  };
};

export default function Error() {
  const { error, clear } = useConnect();
  return (
    <Dialog open={!!error} onClose={clear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
      <DialogTitle id="alert-dialog-title" variant="h6" color="error">
        {'Erreur'}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">{error && error.message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={clear} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

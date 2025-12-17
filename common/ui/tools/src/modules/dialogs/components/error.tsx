import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback } from 'react';
import { useToolsAction, useToolsSelector } from '../../../services/store-api';
import { clearError, getError } from '../store';

export default function Error() {
  const error = useToolsSelector(getError);
  const clear = useToolsAction(clearError);
  const onClose = useCallback(() => {
    clear();
  }, [clear]);

  return (
    <Dialog open={!!error} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="sm">
      <DialogTitle id="alert-dialog-title" variant="h6" color="error">
        {'Erreur'}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">{error && error.message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

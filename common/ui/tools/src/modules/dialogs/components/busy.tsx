import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { useToolsSelector } from '../../../services';
import { getBusy } from '../../io/store';

const useConnect = () => ({
  busy: useToolsSelector(getBusy),
});

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export default function Busy() {
  const { busy } = useConnect();
  return (
    <Dialog open={busy} aria-labelledby="alert-dialog-title">
      <StyledDialogTitle id="alert-dialog-title" variant="h6">
        <Progress color="inherit" />
        {'Traitement en cours ...'}
      </StyledDialogTitle>
    </Dialog>
  );
}

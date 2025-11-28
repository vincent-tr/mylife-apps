import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getOnline } from '../../io';

const useConnect = () => ({
  online: useSelector(getOnline),
});

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
});

const Progress = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export default function Busy() {
  const { online } = useConnect();
  return (
    <Dialog open={!online} aria-labelledby="alert-dialog-title">
      <StyledDialogTitle id="alert-dialog-title" variant="h6">
        <Progress color="inherit" />
        {'Reconnexion en cours ...'}
      </StyledDialogTitle>
    </Dialog>
  );
}

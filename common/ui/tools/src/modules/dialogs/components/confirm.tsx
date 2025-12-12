import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface ConfirmOptions<TValue> {
  title?: string;
  message?: string;
  actions?: {
    text: string;
    value: TValue;
  }[];
}

export interface ConfirmProps<TValue> {
  show: boolean;
  proceed: (value: TValue) => void;
  options: ConfirmOptions<TValue>;
}

export default function Confirm<TValue = unknown>({ show, proceed, options }: ConfirmProps<TValue>) {
  return (
    <Dialog aria-labelledby="dialog-title" open={show} scroll="paper">
      {options.title && <DialogTitle id="dialog-title">{options.title}</DialogTitle>}

      {options.message && (
        <DialogContent dividers>
          <DialogContentText>{options.message}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        {options.actions.map(({ text, value }, index) => (
          <Button key={index} color="primary" onClick={() => proceed(value)}>
            {text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

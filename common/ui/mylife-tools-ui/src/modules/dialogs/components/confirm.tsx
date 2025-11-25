import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

interface ConfirmProps<TValue> {
  show: boolean;
  proceed: (value: TValue) => void;
  options: {
    title?: string;
    message?: string;
    actions: {
      text: string;
      value: TValue;
    }[];
  };
}

const Confirm = <TValue,>({ show, proceed, options }: ConfirmProps<TValue>) => (
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

export default Confirm;

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface InputProps {
  show: boolean;
  proceed: (value: { result: 'ok' | 'cancel'; text?: string }) => void;
  options: {
    title?: string;
    message?: string;
    label: string;
    text?: string;
  };
}

const Input: React.FC<InputProps> = ({ show, proceed, options }) => {
  const [text, setText] = useState(options.text);
  return (
    <Dialog aria-labelledby="dialog-title" open={show} scroll="paper" maxWidth="sm" fullWidth>
      {options.title && <DialogTitle id="dialog-title">{options.title}</DialogTitle>}

      <DialogContent dividers>
        {options.message && <DialogContentText>{options.message}</DialogContentText>}
        <TextField autoFocus fullWidth label={options.label} id="text" value={text || ''} onChange={(e) => setText(e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={() => proceed({ result: 'ok', text })}>
          OK
        </Button>
        <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Input;

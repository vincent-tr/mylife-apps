import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { dialogs } from 'mylife-tools';
import GroupTree from './group-tree';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    minHeight: '90%',
    maxHeight: '90%',
  },
});

export type DialogOptions = Omit<React.ComponentProps<typeof GroupTree>, 'onSelect'>;

interface DialogResult {
  result: 'ok' | 'cancel';
  group?: string;
}

interface GroupSelectorDialogProps {
  show: boolean;
  proceed: (result: DialogResult) => void;
  options: DialogOptions;
}

function GroupSelectorDialog({ show, proceed, options }: GroupSelectorDialogProps) {
  const cancel = useCallback(() => proceed({ result: 'cancel' }), [proceed]);
  const select = useCallback((group: string) => proceed({ result: 'ok', group }), [proceed]);

  return (
    <StyledDialog aria-labelledby="dialog-title" open={show} fullWidth={true} maxWidth="sm">
      <DialogTitle id="dialog-title">Sélectionnez un groupe</DialogTitle>

      <DialogContent dividers>
        <GroupTree onSelect={select} {...options} />
      </DialogContent>

      <DialogActions>
        <Button onClick={cancel}>Annuler</Button>
      </DialogActions>
    </StyledDialog>
  );
}

const selectorDialog = dialogs.create(GroupSelectorDialog);

export interface GroupSelectorButtonProps extends Omit<IconButtonProps, 'onClick' | 'onSelect'> {
  onSelect: (group: string) => void;
  options?: DialogOptions;
}

const GroupSelectorButton = React.forwardRef<HTMLButtonElement, GroupSelectorButtonProps>(({ onSelect, options, ...props }, ref) => {
  const clickHandler = useCallback(async () => {
    const { result, group } = (await selectorDialog({ options })) as DialogResult;
    if (result !== 'ok') {
      return;
    }

    onSelect(group);
  }, [onSelect, options]);

  return <IconButton ref={ref} onClick={clickHandler} {...props} />;
});

GroupSelectorButton.displayName = 'GroupSelectorButton';

export default GroupSelectorButton;

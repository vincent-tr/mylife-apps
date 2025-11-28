import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React from 'react';
import { dialogs } from 'mylife-tools';
import GroupTree from './group-tree';

type FIXME_any = any;

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    minHeight: '90%',
    maxHeight: '90%',
  },
});

interface GroupSelectorDialogProps {
  show: boolean;
  proceed: (result: FIXME_any) => void;
  options: FIXME_any;
}

function GroupSelectorDialog({ show, proceed, options }: GroupSelectorDialogProps) {
  return (
    <StyledDialog aria-labelledby="dialog-title" open={show} fullWidth={true} maxWidth="sm">
      <DialogTitle id="dialog-title">Sélectionnez un groupe</DialogTitle>

      <DialogContent dividers>
        <GroupTree onSelect={(group) => proceed({ result: 'ok', group })} {...options} />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
      </DialogActions>
    </StyledDialog>
  );
}

const selectorDialog = dialogs.create(GroupSelectorDialog);

export interface GroupSelectorButtonProps extends Omit<IconButtonProps, 'onClick' | 'onSelect'> {
  onSelect: (group: string) => void;
  options?: FIXME_any;
}

const GroupSelectorButton = React.forwardRef<HTMLButtonElement, GroupSelectorButtonProps>(({ onSelect, options, ...props }, ref) => {
  const clickHandler = async () => {
    const { result, group } = (await selectorDialog({ options })) as FIXME_any;
    if (result !== 'ok') {
      return;
    }

    onSelect(group);
  };

  return <IconButton ref={ref} onClick={clickHandler} {...props} />;
});

GroupSelectorButton.displayName = 'GroupSelectorButton';

export default GroupSelectorButton;

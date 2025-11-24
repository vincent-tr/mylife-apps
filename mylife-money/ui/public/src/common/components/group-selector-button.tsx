import React from 'react';
import PropTypes from 'prop-types';
import { dialogs } from 'mylife-tools-ui';
import GroupTree from './group-tree';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, styled } from '@mui/material';

type FIXME_any = any;

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    minHeight: '90%',
    maxHeight: '90%',
  },
});

const GroupSelectorDialog = ({ show, proceed, options }) => {
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
};

GroupSelectorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object,
};

const selectorDialog = dialogs.create(GroupSelectorDialog);

interface GroupSelectorButton {
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onSelect: (group: string) => void;
  options?: {};
}

const GroupSelectorButton = React.forwardRef<HTMLButtonElement, GroupSelectorButton>(({ onSelect, options, ...props }, ref) => {
  const clickHandler = async () => {
    const { result, group } = (await selectorDialog({ options })) as FIXME_any;
    if (result !== 'ok') {
      return;
    }

    onSelect(group);
  };

  return <IconButton ref={ref} onClick={clickHandler} {...props} />;
});

export default GroupSelectorButton;

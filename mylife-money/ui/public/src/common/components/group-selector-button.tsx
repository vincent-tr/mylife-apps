'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { mui, dialogs } from 'mylife-tools-ui';
import GroupTree from './group-tree';

const { makeStyles } = mui;

const useStyles = makeStyles({
  paper: {
    minHeight: '90%',
    maxHeight: '90%',
  }
});

const GroupSelectorDialog = ({ show, proceed, options }) => {
  const classes = useStyles();

  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} PaperProps={{ className: classes.paper }} fullWidth={true} maxWidth='sm'>
      <mui.DialogTitle id='dialog-title'>
        Sélectionnez un groupe
      </mui.DialogTitle>

      <mui.DialogContent dividers>
        <GroupTree onSelect={group => proceed({ result: 'ok', group })} {...options} />
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>

    </mui.Dialog>
  );
};

GroupSelectorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
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
    const { result, group } = await selectorDialog({ options });
    if(result !== 'ok') {
      return;
    }

    onSelect(group);
  };

  return (
    <mui.IconButton ref={ref} onClick={clickHandler} {...props}/>
  );
});

GroupSelectorButton.displayName = 'GroupSelectorButton';

GroupSelectorButton.propTypes = {
  onSelect : PropTypes.func.isRequired,
  options: PropTypes.object
};

export default GroupSelectorButton;

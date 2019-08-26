'use strict';

import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import GroupTree from './group-tree';

const GroupSelectorDialog = ({ show, proceed, options }) => (
  <mui.Dialog aria-labelledby='dialog-title' open={show}>
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

GroupSelectorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

const selectorDialog = dialogs.create(GroupSelectorDialog);

const GroupSelectorButton = React.forwardRef(({ onSelect, options, ...props }, ref) => {
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

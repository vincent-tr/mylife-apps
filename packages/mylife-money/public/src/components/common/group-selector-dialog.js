import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import GroupTree from './group-tree';

const SelectorDialog = ({ show, proceed, options }) => (
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

SelectorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

export default dialogs.create(SelectorDialog);

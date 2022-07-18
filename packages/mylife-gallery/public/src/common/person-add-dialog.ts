'use strict';

import { React, PropTypes, mui, useState, dialogs } from 'mylife-tools-ui';

const PersonAddDialog = ({ show, proceed }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} scroll='paper' maxWidth='sm' fullWidth>
      <mui.DialogTitle id='dialog-title'>
        {'Informations de la nouvelle personne'}
      </mui.DialogTitle>

      <mui.DialogContent dividers>
        <mui.DialogContentText>{'Prénom'}</mui.DialogContentText>
        <mui.TextField autoFocus fullWidth value={firstName} onChange={e => setFirstName(e.target.value)} />
        <mui.DialogContentText>{'Nom'}</mui.DialogContentText>
        <mui.TextField fullWidth value={lastName} onChange={e => setLastName(e.target.value)} />
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button color='primary' onClick={() => proceed({ result: 'ok', firstName, lastName })}>OK</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

PersonAddDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func
};

export const personAddDialog = dialogs.create(PersonAddDialog);

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import icons from '../icons';
import base from '../base/index';

import AccountSelectorContainer from '../../containers/common/Account-selector-container';
import ImportButton from './import-button';
import moveDialog from './move-dialog';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  },
  date: {
    width: 100
  }
};

const Header = ({
  showExecuteRules, canProcessOperations,
  accounts,
  minDate, maxDate, account,
  noteText,
  onMinDateChanged, onMaxDateChanged, onAccountChanged, onOperationsImport, onOperationsExecuteRules, onOperationsSetNote, onOperationsMove
}) => (
  <mui.Toolbar>
    <mui.ToolbarGroup>
      <ImportButton accounts={accounts} onImport={onOperationsImport} style={styles.button} />
      {showExecuteRules && (
        <mui.IconButton onClick={onOperationsExecuteRules}
                        style={styles.button}
                        tooltip="Executer les règles sur les opérations">
          <icons.actions.Execute />
        </mui.IconButton>
      )}

      <mui.IconButton onClick={() => moveDialog({ proceed: onOperationsMove})}
                      disabled={!canProcessOperations}
                      style={styles.button}
                      tooltip="Déplacer">
        <icons.actions.Move />
      </mui.IconButton>

      <mui.IconButton onClick={() => base.input({ title: 'Note des opérations', label: 'Note', text: noteText, proceed: onOperationsSetNote })}
                      disabled={!canProcessOperations}
                      style={styles.button}
                      tooltip="Editer la note des opérations sélectionnées">
        <icons.actions.Comment />
      </mui.IconButton>
    </mui.ToolbarGroup>
    <mui.ToolbarGroup>
      <p>Date début</p>
      <mui.IconButton tooltip="Pas de date de début"
                      onClick={() => onMinDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="minDate" value={minDate} onChange={(event, date) => onMinDateChanged(date)} textFieldStyle={styles.date} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Date fin</p>
      <mui.IconButton tooltip="Pas de date de fin"
                      onClick={() => onMaxDateChanged(null)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker id="maxDate" value={maxDate} onChange={(event, date) => onMaxDateChanged(date)} textFieldStyle={styles.date} />
    </mui.ToolbarGroup>

    <mui.ToolbarGroup>
      <p>Compte</p>
      <AccountSelectorContainer allowNull={true} value={account} onChange={onAccountChanged} width={200} />
    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Header.propTypes = {
  showExecuteRules         : PropTypes.bool.isRequired,
  canProcessOperations     : PropTypes.bool.isRequired,
  accounts                 : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  minDate                  : PropTypes.instanceOf(Date),
  maxDate                  : PropTypes.instanceOf(Date),
  account                  : PropTypes.string,
  noteText                 : PropTypes.string,
  onMinDateChanged         : PropTypes.func.isRequired,
  onMaxDateChanged         : PropTypes.func.isRequired,
  onAccountChanged         : PropTypes.func.isRequired,
  onOperationsImport       : PropTypes.func.isRequired,
  onOperationsExecuteRules : PropTypes.func.isRequired,
  onOperationsSetNote      : PropTypes.func.isRequired,
  onOperationsMove         : PropTypes.func.isRequired,
};

export default Header;

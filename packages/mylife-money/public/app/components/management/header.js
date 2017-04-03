'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import base from '../base/index';

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
      <mui.SelectField value={account} onChange={(event, index, value) => onAccountChanged(value)} width={200}>
        {([{ id: null, display: 'Tous' }].concat(accounts)).map(account => (<mui.MenuItem key={account.id} value={account.id} primaryText={account.display} />))}
      </mui.SelectField>
    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Header.propTypes = {
  showExecuteRules         : React.PropTypes.bool.isRequired,
  canProcessOperations     : React.PropTypes.bool.isRequired,
  accounts                 : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  minDate                  : React.PropTypes.instanceOf(Date),
  maxDate                  : React.PropTypes.instanceOf(Date),
  account                  : React.PropTypes.string,
  noteText                 : React.PropTypes.string,
  onMinDateChanged         : React.PropTypes.func.isRequired,
  onMaxDateChanged         : React.PropTypes.func.isRequired,
  onAccountChanged         : React.PropTypes.func.isRequired,
  onOperationsImport       : React.PropTypes.func.isRequired,
  onOperationsExecuteRules : React.PropTypes.func.isRequired,
  onOperationsSetNote      : React.PropTypes.func.isRequired,
  onOperationsMove         : React.PropTypes.func.isRequired,
};

export default Header;

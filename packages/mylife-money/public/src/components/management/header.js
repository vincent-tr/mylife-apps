'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';
import icons from '../icons';
import base from '../base/index';

import AccountSelectorContainer from '../../containers/common/account-selector-container';
import ImportButton from './import-button';
import GroupSelectorButton from '../common/group-selector-button';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
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
    <ImportButton accounts={accounts} onImport={onOperationsImport} style={styles.button} />
    {showExecuteRules && (
      <mui.IconButton onClick={onOperationsExecuteRules}
                      style={styles.button}
                      tooltip="Executer les règles sur les opérations">
        <icons.actions.Execute />
      </mui.IconButton>
    )}

    <GroupSelectorButton onSelect={onOperationsMove}
                    disabled={!canProcessOperations}
                    style={styles.button}
                    tooltip="Déplacer">
      <icons.actions.Move />
    </GroupSelectorButton>

    <mui.IconButton onClick={() => base.input({ title: 'Note des opérations', label: 'Note', text: noteText, proceed: onOperationsSetNote })}
                    disabled={!canProcessOperations}
                    style={styles.button}
                    tooltip="Editer la note des opérations sélectionnées">
      <icons.actions.Comment />
    </mui.IconButton>

    {/* Separator */}


    <p>Date début</p>
    <mui.IconButton tooltip="Pas de date de début"
                    onClick={() => onMinDateChanged(null)}
                    style={styles.button}>
      <icons.actions.Delete />
    </mui.IconButton>
    <mui.DatePicker value={minDate} onChange={onMinDateChanged} />

    {/* Separator */}

    <p>Date fin</p>
    <mui.IconButton tooltip="Pas de date de fin"
                    onClick={() => onMaxDateChanged(null)}
                    style={styles.button}>
      <icons.actions.Delete />
    </mui.IconButton>
    <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} />

    {/* Separator */}

    <p>Compte</p>
    <AccountSelectorContainer allowNull={true} value={account} onChange={onAccountChanged} width={200} />
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

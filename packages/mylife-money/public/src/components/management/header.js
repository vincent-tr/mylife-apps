'use strict';

import { React, useMemo, mui, useSelector, useDispatch } from 'mylife-tools-ui';
import icons from '../icons';
import base from '../base/index';
import { setMinDate, setMaxDate, setAccount, importOperations, operationsExecuteRules, operationsSetNote, moveOperations } from '../../actions/management';
import { getSelectedOperations, getSelectedGroupId } from '../../selectors/management';
import { getAccounts } from '../../selectors/accounts';

import AccountSelector from '../common/account-selector';
import ImportButton from './import-button';
import GroupSelectorButton from '../common/group-selector-button';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => {
      const selectedOperations = getSelectedOperations(state);
      return {
        showExecuteRules     : !getSelectedGroupId(state),
        canProcessOperations : !!selectedOperations.length,
        accounts             : getAccounts(state),
        minDate              : state.management.minDate,
        maxDate              : state.management.maxDate,
        account              : state.management.account,
        noteText             : selectedOperations.length === 1 ? selectedOperations[0].note : ''
      };
    }),
    ...useMemo(() => ({
      onMinDateChanged         : (value) => dispatch(setMinDate(value)),
      onMaxDateChanged         : (value) => dispatch(setMaxDate(value)),
      onAccountChanged         : (value) => dispatch(setAccount(value)),
      onOperationsImport       : (account, file) => dispatch(importOperations(account, file)),
      onOperationsExecuteRules : () => dispatch(operationsExecuteRules()),
      onOperationsSetNote      : (note) => dispatch(operationsSetNote(note)),
      onOperationsMove         : (group) => dispatch(moveOperations(group))
    }), [dispatch])
  };
};

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  }
};

const Header = () => {
  const {
    showExecuteRules, canProcessOperations,
    accounts,
    minDate, maxDate, account,
    noteText,
    onMinDateChanged, onMaxDateChanged, onAccountChanged, onOperationsImport, onOperationsExecuteRules, onOperationsSetNote, onOperationsMove
  } = useConnect();

  return (
    <mui.Toolbar>
      <ImportButton accounts={accounts} onImport={onOperationsImport} style={styles.button} />
      {showExecuteRules && (
        <mui.IconButton onClick={onOperationsExecuteRules} style={styles.button} tooltip="Executer les règles sur les opérations">
          <icons.actions.Execute />
        </mui.IconButton>
      )}

      <GroupSelectorButton onSelect={onOperationsMove} disabled={!canProcessOperations} style={styles.button} tooltip="Déplacer">
        <icons.actions.Move />
      </GroupSelectorButton>

      <mui.IconButton
        onClick={() => base.input({ title: 'Note des opérations', label: 'Note', text: noteText, proceed: onOperationsSetNote })}
        disabled={!canProcessOperations}
        style={styles.button}
        tooltip="Editer la note des opérations sélectionnées">
        <icons.actions.Comment />
      </mui.IconButton>

      {/* Separator */}


      <p>Date début</p>
      <mui.IconButton tooltip="Pas de date de début" onClick={() => onMinDateChanged(null)} style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker value={minDate} onChange={onMinDateChanged} />

      {/* Separator */}

      <p>Date fin</p>
      <mui.IconButton tooltip="Pas de date de fin" onClick={() => onMaxDateChanged(null)} style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
      <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} />

      {/* Separator */}

      <p>Compte</p>
      <AccountSelector allowNull={true} value={account} onChange={onAccountChanged} width={200} />
    </mui.Toolbar>
  );
};

export default Header;

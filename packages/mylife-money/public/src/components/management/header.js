'use strict';

import { React, useMemo, mui, useSelector, useDispatch, ToolbarFieldTitle, ToolbarSeparator } from 'mylife-tools-ui';
import icons from '../icons';
import base from '../base';
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

const useStyles = mui.makeStyles({
  accountField: {
    minWidth: 200
  }
});

const Header = () => {
  const {
    showExecuteRules, canProcessOperations,
    accounts,
    minDate, maxDate, account,
    noteText,
    onMinDateChanged, onMaxDateChanged, onAccountChanged, onOperationsImport, onOperationsExecuteRules, onOperationsSetNote, onOperationsMove
  } = useConnect();

  const classes = useStyles();

  return (
    <mui.Toolbar>
      <ImportButton accounts={accounts} onImport={onOperationsImport} />
      {showExecuteRules && (
        <mui.Tooltip title='Executer les règles sur les opérations'>
          <mui.IconButton onClick={onOperationsExecuteRules}>
            <icons.actions.Execute />
          </mui.IconButton>
        </mui.Tooltip>
      )}

      <mui.Tooltip title='Déplacer'>
        <div>
          <GroupSelectorButton onSelect={onOperationsMove} disabled={!canProcessOperations}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </mui.Tooltip>

      <mui.Tooltip title='Editer la note des opérations sélectionnées'>
        <div>
          <mui.IconButton
            onClick={() => base.input({ title: 'Note des opérations', label: 'Note', text: noteText, proceed: onOperationsSetNote })}
            disabled={!canProcessOperations}>
            <icons.actions.Comment />
          </mui.IconButton>
        </div>
      </mui.Tooltip>

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
      <mui.DatePicker value={minDate} onChange={onMinDateChanged} clearable autoOk format='DD/MM/YYYY' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
      <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} clearable autoOk format='DD/MM/YYYY' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Compte</ToolbarFieldTitle>
      <AccountSelector allowNull={true} value={account} onChange={onAccountChanged} className={classes.accountField} />
    </mui.Toolbar>
  );
};

export default Header;

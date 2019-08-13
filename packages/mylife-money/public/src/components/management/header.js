'use strict';

import { React, useMemo, mui, useSelector, useDispatch, ToolbarFieldTitle, ToolbarSeparator, dialogs, useScreenSize } from 'mylife-tools-ui';
import icons from '../icons';
import { setMinDate, setMaxDate, setAccount, importOperations, operationsExecuteRules, operationsSetNote, moveOperations } from '../../actions/management';
import { getSelectedOperations, getCriteria } from '../../selectors/management';
import { getAccounts } from '../../selectors/reference';

import AccountSelector from '../common/account-selector';
import ImportButton from './import-button';
import GroupSelectorButton from '../common/group-selector-button';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => {
      const selectedOperations = getSelectedOperations(state);
      const criteria = getCriteria(state);
      return {
        showExecuteRules     : !criteria.group,
        canProcessOperations : !!selectedOperations.length,
        accounts             : getAccounts(state),
        minDate              : criteria.minDate,
        maxDate              : criteria.maxDate,
        account              : criteria.account,
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

  const screenSize = useScreenSize();

  const editNote = async () => {
    const { result, text } = await dialogs.input({ title: 'Note des opérations', label: 'Note', text: noteText });
    if(result !== 'ok') {
      return;
    }
    onOperationsSetNote(text);
  };

  const selectors = (
    <React.Fragment>
      <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
      <mui.DatePicker value={minDate} onChange={onMinDateChanged} clearable autoOk format='dd/MM/yyyy' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
      <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} clearable autoOk format='dd/MM/yyyy' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Compte</ToolbarFieldTitle>
      <AccountSelector allowNull={true} value={account} onChange={onAccountChanged} className={classes.accountField} />
    </React.Fragment>
  );

  const toolbar = (
    <React.Fragment>
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
            onClick={editNote}
            disabled={!canProcessOperations}>
            <icons.actions.Comment />
          </mui.IconButton>
        </div>
      </mui.Tooltip>
    </React.Fragment>
  );

  const oneRowHeader = (
    <mui.Toolbar>
      {toolbar}
      <ToolbarSeparator />
      {selectors}
    </mui.Toolbar>
  );

  const twoRowHeader = (
    <React.Fragment>
      <mui.Toolbar variant='dense'>
        {selectors}
      </mui.Toolbar>
      <mui.Toolbar variant='dense'>
        {toolbar}
      </mui.Toolbar>
    </React.Fragment>
  );

  switch(screenSize) {
    case 'phone':
    case 'tablet':
    case 'laptop':
      return twoRowHeader;

    case 'wide':
      return oneRowHeader;
  }
};

export default Header;

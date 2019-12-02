'use strict';

import { React, useMemo, mui, useSelector, useDispatch, formatDate, ToolbarFieldTitle, ToolbarSeparator, DebouncedTextField, SummaryExpansionPanel, DateOrYearSelector, dialogs, useScreenSize } from 'mylife-tools-ui';
import icons from '../../../common/icons';
import { setMinDate, setMaxDate, setAccount, setLookupText, importOperations, operationsExecuteRules, operationsSetNote, moveOperations } from '../../actions';
import { getSelectedOperations, getCriteria } from '../../selectors';
import { getAccounts, getGroup } from '../../../reference/selectors';

import AccountSelector from '../../../common/components/account-selector';
import ImportButton from './import-button';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import GroupDenseSelector from './group-dense-selector';

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
        selectedGroup        : getGroup(state, { group: criteria.group }),
        account              : criteria.account,
        lookupText           : criteria.lookupText,
        noteText             : selectedOperations.length === 1 ? selectedOperations[0].note : ''
      };
    }),
    ...useMemo(() => ({
      onMinDateChanged         : (value) => dispatch(setMinDate(value)),
      onMaxDateChanged         : (value) => dispatch(setMaxDate(value)),
      onAccountChanged         : (value) => dispatch(setAccount(value)),
      onLookupTextChanged      : (value) => dispatch(setLookupText(value)),
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
  },
  expansionPanelContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const Header = () => {
  const {
    showExecuteRules, canProcessOperations,
    accounts,
    minDate, maxDate, selectedGroup, account, lookupText,
    noteText,
    onMinDateChanged, onMaxDateChanged, onAccountChanged, onLookupTextChanged, onOperationsImport, onOperationsExecuteRules, onOperationsSetNote, onOperationsMove
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

  const minDateSelector = (
    <DateOrYearSelector value={minDate} onChange={onMinDateChanged} showYearSelector />
  );

  const maxDateSelector = (
    <DateOrYearSelector value={maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
  );

  const selectors = (
    <React.Fragment>
      <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
      {minDateSelector}

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
      {maxDateSelector}

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

  const search = (
    <React.Fragment>
      <ToolbarFieldTitle>Libellé ou note</ToolbarFieldTitle>
      <DebouncedTextField value={lookupText} onChange={onLookupTextChanged} type='search' />
    </React.Fragment>
  );

  const wideHeader = (
    <mui.Toolbar>
      {toolbar}
      <ToolbarSeparator />
      {selectors}
      <ToolbarSeparator />
      {search}
    </mui.Toolbar>
  );

  const normalHeader = (
    <React.Fragment>
      <mui.Toolbar variant='dense'>
        {selectors}
      </mui.Toolbar>
      <mui.Toolbar variant='dense'>
        {toolbar}
        <ToolbarSeparator />
        {search}
      </mui.Toolbar>
    </React.Fragment>
  );

  const denseHeader = (
    <React.Fragment>
      <SummaryExpansionPanel
        collapsedSummary={<mui.Typography>{`Du ${format(minDate)} au ${format(maxDate)}, ${selectedGroup.display}`}</mui.Typography>}
        expandedSummary={<mui.Typography>{'Critères d\'affichage'}</mui.Typography>}>
        <div className={classes.expansionPanelContainer}>
          <mui.Toolbar variant='dense'>
            {minDateSelector}
            {maxDateSelector}
          </mui.Toolbar>
          <mui.Toolbar variant='dense'>
            <ToolbarFieldTitle>Groupe</ToolbarFieldTitle>
            <GroupDenseSelector />
          </mui.Toolbar>
          <mui.Toolbar variant='dense'>
            {search}
          </mui.Toolbar>
        </div>
      </SummaryExpansionPanel>
      <mui.Toolbar variant='dense'>
        {toolbar}
      </mui.Toolbar>
    </React.Fragment>
  );

  switch(screenSize) {
    case 'phone':
      return denseHeader;

    case 'tablet':
    case 'laptop':
      return normalHeader;

    case 'wide':
      return wideHeader;
  }
};

export default Header;

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

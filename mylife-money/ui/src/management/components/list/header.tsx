import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format as formatDate } from 'date-fns';
import React, { useMemo } from 'react';
import { ToolbarFieldTitle, ToolbarSeparator, DebouncedTextField, SummaryAccordion, DateOrYearSelector, dialogs, useScreenSize } from 'mylife-tools';
import AccountSelector from '../../../common/components/account-selector';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getAccounts, getGroup } from '../../../reference/selectors';
import { useAppSelector, useAppDispatch } from '../../../store';
import {
  setMinDate,
  setMaxDate,
  setAccount,
  setLookupText,
  importOperations,
  operationsExecuteRules,
  operationsSetNote,
  moveOperations,
  getSelectedOperations,
  getCriteria,
} from '../../store';
import GroupDenseSelector from './group-dense-selector';
import ImportButton from './import-button';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => {
      const selectedOperations = getSelectedOperations(state);
      const criteria = getCriteria(state);
      return {
        showExecuteRules: !criteria.group,
        canProcessOperations: !!selectedOperations.length,
        accounts: getAccounts(state),
        minDate: criteria.minDate,
        maxDate: criteria.maxDate,
        selectedGroup: getGroup(state, criteria.group) as FIXME_any,
        account: criteria.account as FIXME_any,
        lookupText: criteria.lookupText,
        noteText: selectedOperations.length === 1 ? (selectedOperations[0] as FIXME_any).note : '',
      };
    }),
    ...useMemo(
      () => ({
        onMinDateChanged: (value) => dispatch(setMinDate(value)),
        onMaxDateChanged: (value) => dispatch(setMaxDate(value)),
        onAccountChanged: (value) => dispatch(setAccount(value)),
        onLookupTextChanged: (value) => dispatch(setLookupText(value)),
        onOperationsImport: (account, file) => dispatch(importOperations({ account, file })),
        onOperationsExecuteRules: () => dispatch(operationsExecuteRules()),
        onOperationsSetNote: (note) => dispatch(operationsSetNote(note)),
        onOperationsMove: (group) => dispatch(moveOperations(group)),
      }),
      [dispatch]
    ),
  };
};

const AccountField = styled(AccountSelector)({
  minWidth: 200,
});

const ExpansionPanelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export default function Header() {
  const {
    showExecuteRules,
    canProcessOperations,
    accounts,
    minDate,
    maxDate,
    selectedGroup,
    account,
    lookupText,
    noteText,
    onMinDateChanged,
    onMaxDateChanged,
    onAccountChanged,
    onLookupTextChanged,
    onOperationsImport,
    onOperationsExecuteRules,
    onOperationsSetNote,
    onOperationsMove,
  } = useConnect();

  const screenSize = useScreenSize();

  const editNote = async () => {
    const { result, text } = (await dialogs.input({ title: 'Note des opérations', label: 'Note', text: noteText })) as FIXME_any;
    if (result !== 'ok') {
      return;
    }
    onOperationsSetNote(text);
  };

  const minDateSelector = <DateOrYearSelector value={minDate} onChange={onMinDateChanged} showYearSelector />;

  const maxDateSelector = <DateOrYearSelector value={maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />;

  const selectors = (
    <React.Fragment>
      <ToolbarFieldTitle>{'Date début'}</ToolbarFieldTitle>
      {minDateSelector}

      <ToolbarSeparator />

      <ToolbarFieldTitle>{'Date fin'}</ToolbarFieldTitle>
      {maxDateSelector}

      <ToolbarSeparator />

      <ToolbarFieldTitle>{'Compte'}</ToolbarFieldTitle>
      <AccountField allowNull={true} value={account} onChange={onAccountChanged} />
    </React.Fragment>
  );

  const toolbar = (
    <React.Fragment>
      <ImportButton accounts={accounts} onImport={onOperationsImport} />
      {showExecuteRules && (
        <Tooltip title={'Executer les règles sur les opérations'}>
          <IconButton onClick={onOperationsExecuteRules}>
            <icons.actions.Execute />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Déplacer">
        <div>
          <GroupSelectorButton onSelect={onOperationsMove} disabled={!canProcessOperations}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>

      <Tooltip title={'Editer la note des opérations sélectionnées'}>
        <div>
          <IconButton onClick={editNote} disabled={!canProcessOperations}>
            <icons.actions.Comment />
          </IconButton>
        </div>
      </Tooltip>
    </React.Fragment>
  );

  const search = (
    <React.Fragment>
      <ToolbarFieldTitle>{'Libellé ou note'}</ToolbarFieldTitle>
      <DebouncedTextField value={lookupText} onChange={onLookupTextChanged} type="search" />
    </React.Fragment>
  );

  const wideHeader = (
    <Toolbar>
      {toolbar}
      <ToolbarSeparator />
      {selectors}
      <ToolbarSeparator />
      {search}
    </Toolbar>
  );

  const normalHeader = (
    <React.Fragment>
      <Toolbar variant="dense">{selectors}</Toolbar>
      <Toolbar variant="dense">
        {toolbar}
        <ToolbarSeparator />
        {search}
      </Toolbar>
    </React.Fragment>
  );

  const denseHeader = (
    <React.Fragment>
      <SummaryAccordion
        collapsedSummary={<Typography>{`Du ${format(minDate)} au ${format(maxDate)}, ${selectedGroup && selectedGroup.display}`}</Typography>}
        expandedSummary={<Typography>{"Critères d'affichage"}</Typography>}
      >
        <ExpansionPanelContainer>
          <Toolbar variant="dense">
            {minDateSelector}
            {maxDateSelector}
          </Toolbar>
          <Toolbar variant="dense">
            <ToolbarFieldTitle>{'Groupe'}</ToolbarFieldTitle>
            <GroupDenseSelector />
          </Toolbar>
          <Toolbar variant="dense">{search}</Toolbar>
        </ExpansionPanelContainer>
      </SummaryAccordion>
      <Toolbar variant="dense">{toolbar}</Toolbar>
    </React.Fragment>
  );

  switch (screenSize) {
    case 'phone':
      return denseHeader;

    case 'tablet':
    case 'laptop':
      return normalHeader;

    case 'wide':
      return wideHeader;
  }
}

function format(date) {
  if (!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

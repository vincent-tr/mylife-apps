import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { format as formatDate } from 'date-fns';
import React, { useCallback } from 'react';
import { ToolbarFieldTitle, ToolbarSeparator, DebouncedTextField, SummaryAccordion, DateOrYearSelector, dialogs, useScreenSize } from 'mylife-tools';
import AccountSelector from '../../../common/components/account-selector';
import GroupSelectorButton from '../../../common/components/group-selector-button';
import icons from '../../../common/icons';
import { getGroup } from '../../../reference/selectors';
import { useAppSelector, useAppAction } from '../../../store-api';
import { operationsExecuteRules, operationsSetNote, moveOperations, getSelectedOperations, getCriteria, setCriteriaValue } from '../../store';
import GroupDenseSelector from './group-dense-selector';
import ImportButton from './import-button';

const AccountField = styled(AccountSelector)({
  minWidth: 200,
});

const ExpansionPanelContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export default function Header() {
  const selectedOperations = useAppSelector(getSelectedOperations);
  const criteria = useAppSelector(getCriteria);
  const selectedGroup = useAppSelector((state) => getGroup(state, criteria.group));
  const showExecuteRules = !criteria.group;
  const canProcessOperations = selectedOperations.length > 0;
  const noteText = selectedOperations.length === 1 ? selectedOperations[0].note : '';
  const updateCriteria = useAppAction(setCriteriaValue);
  const executeRules = useAppAction(operationsExecuteRules);
  const onOperationsSetNote = useAppAction(operationsSetNote);
  const onOperationsMove = useAppAction(moveOperations);

  const onMinDateChanged = useCallback(
    (value: Date | null) => {
      updateCriteria({ name: 'minDate', value });
    },
    [updateCriteria]
  );

  const onMaxDateChanged = useCallback(
    (value: Date | null) => {
      updateCriteria({ name: 'maxDate', value });
    },
    [updateCriteria]
  );

  const onAccountChanged = useCallback(
    (value: string | null) => {
      updateCriteria({ name: 'account', value });
    },
    [updateCriteria]
  );

  const onLookupTextChanged = useCallback(
    (value: string | null) => {
      updateCriteria({ name: 'lookupText', value });
    },
    [updateCriteria]
  );

  const onOperationsExecuteRules = useCallback(() => {
    executeRules();
  }, [executeRules]);

  const screenSize = useScreenSize();

  const editNote = useCallback(async () => {
    const { result, text } = await dialogs.input({ title: 'Note des opérations', label: 'Note', text: noteText });
    if (result !== 'ok') {
      return;
    }
    onOperationsSetNote(text);
  }, [onOperationsSetNote, noteText]);

  const minDateSelector = <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />;

  const maxDateSelector = <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />;

  const selectors = (
    <React.Fragment>
      <ToolbarFieldTitle>{'Date début'}</ToolbarFieldTitle>
      {minDateSelector}

      <ToolbarSeparator />

      <ToolbarFieldTitle>{'Date fin'}</ToolbarFieldTitle>
      {maxDateSelector}

      <ToolbarSeparator />

      <ToolbarFieldTitle>{'Compte'}</ToolbarFieldTitle>
      <AccountField allowNull={true} value={criteria.account} onChange={onAccountChanged} />
    </React.Fragment>
  );

  const toolbar = (
    <React.Fragment>
      <ImportButton />
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
      <DebouncedTextField value={criteria.lookupText} onChange={onLookupTextChanged} type="search" />
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
        collapsedSummary={<Typography>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${selectedGroup && selectedGroup.display}`}</Typography>}
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

function format(date: Date | null) {
  if (!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

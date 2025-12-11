import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format as formatDate } from 'date-fns';
import React, { useCallback } from 'react';
import { SummaryAccordion, DateOrYearSelector, CriteriaField, useScreenPhone } from 'mylife-tools';
import { ReportingCriteria, ReportingDisplay } from '../../../api';
import AccountSelector from '../../../common/components/account-selector';
import ExportButton from '../common/export-button';
import GroupCriteriaField from '../common/group-field';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const Title = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const AccountField = styled(AccountSelector)({
  minWidth: 200,
});

export interface CriteriaProps {
  criteria: ReportingCriteria;
  onCriteriaChanged: (criteria: ReportingCriteria) => void;
  display: ReportingDisplay;
  onDisplayChanged: (display: ReportingDisplay) => void;
  onExport: () => void;
  additionalComponents?: React.ReactNode;
}

export default function Criteria({ criteria, onCriteriaChanged, display, onDisplayChanged, onExport, additionalComponents }: CriteriaProps) {
  const isPhone = useScreenPhone();

  const onMinDateChanged = useCallback((value: Date) => {
    onCriteriaChanged({ ...criteria, minDate: value });
  }, [onCriteriaChanged, criteria]);

  const onMaxDateChanged = useCallback((value: Date) => {
    onCriteriaChanged({ ...criteria, maxDate: value });
  }, [onCriteriaChanged, criteria]);

  const onAccountChanged = useCallback((value: string | null) => {
    onCriteriaChanged({ ...criteria, account: value });
  }, [onCriteriaChanged, criteria]);

  const onChildrenChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onCriteriaChanged({ ...criteria, children: e.target.checked });
  }, [onCriteriaChanged, criteria]);

  const onInvertChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDisplayChanged({ ...display, invert: e.target.checked });
  }, [onDisplayChanged, display]);

  const onFullnamesChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDisplayChanged({ ...display, fullnames: e.target.checked });
  }, [onDisplayChanged, display]);

  const onGroupAdd = useCallback(() => {
    onCriteriaChanged({ ...criteria, groups: [...criteria.groups, null] });
  }, [onCriteriaChanged, criteria]);

  const onGroupChanged = useCallback((index: number, groupId: string) => {
    const newGroups = [...criteria.groups];
    newGroups[index] = groupId;
    onCriteriaChanged({ ...criteria, groups: newGroups });
  }, [onCriteriaChanged, criteria]);

  const onGroupDelete = useCallback((index: number) => {
    const newGroups = [...criteria.groups];
    newGroups.splice(index, 1);
    onCriteriaChanged({ ...criteria, groups: newGroups });
  }, [onCriteriaChanged, criteria]);

  const grid = isPhone ? (
    <Grid container spacing={2}>
      <Grid size={6}>
        <CriteriaField label="Du">
          <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Au">
          <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Compte">
          <AccountField allowNull={true} value={criteria.account} onChange={onAccountChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Inverser montant">
          <Checkbox color="primary" checked={display.invert} onChange={onInvertChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Afficher les groupes enfants">
          <Checkbox color="primary" checked={criteria.children} onChange={onChildrenChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Afficher les noms complets">
          <Checkbox color="primary" checked={display.fullnames} onChange={onFullnamesChanged} />
        </CriteriaField>
      </Grid>
      {additionalComponents}
      <Grid size={12}>
        <GroupCriteriaField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={2}>
      <Grid size={4}>
        <CriteriaField label="Date début">
          <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Date fin">
          <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Compte">
          <AccountField allowNull={true} value={criteria.account} onChange={onAccountChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Inverser montant">
          <Checkbox color="primary" checked={display.invert} onChange={onInvertChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Afficher les groupes enfants">
          <Checkbox color="primary" checked={criteria.children} onChange={onChildrenChanged} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Afficher les noms complets">
          <Checkbox color="primary" checked={display.fullnames} onChange={onFullnamesChanged} />
        </CriteriaField>
      </Grid>
      {additionalComponents}
      <Grid size={12}>
        <GroupCriteriaField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
      </Grid>
    </Grid>
  );

  return (
    <SummaryAccordion expandedSummary={<ExpandedSummary onExport={onExport} />} collapsedSummary={<CollapsedSummary criteria={criteria} onExport={onExport} />}>
      {grid}
    </SummaryAccordion>
  );
}

interface ExpandedSummaryProps {
  onExport: () => void;
}

function ExpandedSummary({ onExport }: ExpandedSummaryProps) {
  return (
    <Container>
      <Title variant="h6">Critères de sélection</Title>
      <ExportButton onClick={onExport} />
    </Container>
  );
}

interface CollapsedSummaryProps {
  criteria: ReportingCriteria;
  onExport: () => void;
}

function CollapsedSummary({ criteria, onExport }: CollapsedSummaryProps) {
  return (
    <Container>
      <Title>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${criteria.groups.length} groupe(s) sélectionné(s)`}</Title>
      <ExportButton onClick={onExport} />
    </Container>
  );
}

function format(date: Date | null) {
  if (!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

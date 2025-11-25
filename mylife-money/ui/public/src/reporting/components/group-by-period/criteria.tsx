import React from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import { SummaryAccordion, DateOrYearSelector, CriteriaField, useScreenPhone } from 'mylife-tools-ui';

import AccountSelector from '../../../common/components/account-selector';
import GroupCriteriaField from '../common/group-field';
import ExportButton from '../common/export-button';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const Title = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(4),
}));

const Criteria = ({ criteria, onCriteriaChanged, display, onDisplayChanged, onExport, additionalComponents }) => {
  const isPhone = useScreenPhone();

  const setCriteria = (name, value) => onCriteriaChanged({ ...criteria, [name]: value });
  const onChildrenChanged = (value) => setCriteria('children', value);
  const onMinDateChanged = (value) => setCriteria('minDate', value);
  const onMaxDateChanged = (value) => setCriteria('maxDate', value);
  const onAccountChanged = (value) => setCriteria('account', value);

  const setDisplay = (name, value) => onDisplayChanged({ ...display, [name]: value });
  const onInvertChanged = (value) => setDisplay('invert', value);
  const onFullnamesChanged = (value) => setDisplay('fullnames', value);

  const onGroupAdd = () => setCriteria('groups', [...criteria.groups, null]);
  const onGroupChanged = (index, value) =>
    setCriteria(
      'groups',
      criteria.groups.map((group, i) => (i === index ? value : group))
    );
  const onGroupDelete = (index) =>
    setCriteria(
      'groups',
      criteria.groups.filter((_, i) => i !== index)
    );

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
          <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Inverser montant">
          <Checkbox color="primary" checked={display.invert} onChange={(e) => onInvertChanged(e.target.checked)} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Afficher les groupes enfants">
          <Checkbox color="primary" checked={criteria.children} onChange={(e) => onChildrenChanged(e.target.checked)} />
        </CriteriaField>
      </Grid>
      <Grid size={6}>
        <CriteriaField label="Afficher les noms complets">
          <Checkbox color="primary" checked={display.fullnames} onChange={(e) => onFullnamesChanged(e.target.checked)} />
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
          <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Inverser montant">
          <Checkbox color="primary" checked={display.invert} onChange={(e) => onInvertChanged(e.target.checked)} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Afficher les groupes enfants">
          <Checkbox color="primary" checked={criteria.children} onChange={(e) => onChildrenChanged(e.target.checked)} />
        </CriteriaField>
      </Grid>
      <Grid size={4}>
        <CriteriaField label="Afficher les noms complets">
          <Checkbox color="primary" checked={display.fullnames} onChange={(e) => onFullnamesChanged(e.target.checked)} />
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
};

Criteria.propTypes = {
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  additionalComponents: PropTypes.node,
};

export default Criteria;

const ExpandedSummary = ({ onExport }) => {
  return (
    <Container>
      <Title variant="h6">Critères de sélection</Title>
      <ExportButton onClick={onExport} />
    </Container>
  );
};

ExpandedSummary.propTypes = {
  onExport: PropTypes.func.isRequired,
};

const CollapsedSummary = ({ criteria, onExport }) => {
  return (
    <Container>
      <Title>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${criteria.groups.size} groupe(s) sélectionné(s)`}</Title>
      <ExportButton onClick={onExport} />
    </Container>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired,
  onExport: PropTypes.func.isRequired,
};

function format(date) {
  if (!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

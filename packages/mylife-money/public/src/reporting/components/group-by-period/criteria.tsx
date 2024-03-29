'use strict';

import { React, PropTypes, mui, formatDate, SummaryAccordion, DateOrYearSelector, CriteriaField, useScreenPhone } from 'mylife-tools-ui';

import AccountSelector from '../../../common/components/account-selector';
import GroupCriteriaField from '../common/group-field';
import ExportButton from '../common/export-button';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginRight: theme.spacing(4)
  },
  button: {
  }
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

  const onGroupAdd = () => setCriteria('groups', criteria.groups.push(null));
  const onGroupChanged = (index, value) => setCriteria('groups', criteria.groups.set(index, value));
  const onGroupDelete = (index) => setCriteria('groups', criteria.groups.delete(index));

  const grid = isPhone ? (
    <mui.Grid container spacing={2}>
      <mui.Grid item xs={6}>
        <CriteriaField label='Du'>
          <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <CriteriaField label='Au'>
          <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <CriteriaField label='Compte'>
          <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <CriteriaField label='Inverser montant'>
          <mui.Checkbox color='primary' checked={display.invert} onChange={e => onInvertChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <CriteriaField label='Afficher les groupes enfants'>
          <mui.Checkbox color='primary' checked={criteria.children} onChange={e => onChildrenChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <CriteriaField label='Afficher les noms complets'>
          <mui.Checkbox color='primary' checked={display.fullnames} onChange={e => onFullnamesChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      {additionalComponents}
      <mui.Grid item xs={12}>
        <GroupCriteriaField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
      </mui.Grid>
    </mui.Grid>
  ) : (
    <mui.Grid container spacing={2}>
      <mui.Grid item xs={4}>
        <CriteriaField label='Date début'>
          <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={4}>
        <CriteriaField label='Date fin'>
          <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={4}>
        <CriteriaField label='Compte'>
          <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={4}>
        <CriteriaField label='Inverser montant'>
          <mui.Checkbox color='primary' checked={display.invert} onChange={e => onInvertChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={4}>
        <CriteriaField label='Afficher les groupes enfants'>
          <mui.Checkbox color='primary' checked={criteria.children} onChange={e => onChildrenChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={4}>
        <CriteriaField label='Afficher les noms complets'>
          <mui.Checkbox color='primary' checked={display.fullnames} onChange={e => onFullnamesChanged(e.target.checked)} />
        </CriteriaField>
      </mui.Grid>
      {additionalComponents}
      <mui.Grid item xs={12}>
        <GroupCriteriaField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
      </mui.Grid>
    </mui.Grid>
  );

  return (
    <SummaryAccordion
      expandedSummary={<ExpandedSummary onExport={onExport} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} onExport={onExport} />}>
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
  additionalComponents: PropTypes.node
};

export default Criteria;

const ExpandedSummary = ({ onExport }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography variant='h6' className={classes.title}>Critères de sélection</mui.Typography>
      <ExportButton onClick={onExport} className={classes.button} />
    </div>
  );
};

ExpandedSummary.propTypes = {
  onExport: PropTypes.func.isRequired
};

const CollapsedSummary = ({ criteria, onExport }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.title}>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${criteria.groups.size} groupe(s) sélectionné(s)`}</mui.Typography>
      <ExportButton onClick={onExport} className={classes.button} />
    </div>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired,
  onExport: PropTypes.func.isRequired
};

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

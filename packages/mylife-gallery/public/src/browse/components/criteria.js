'use strict';

import { React, PropTypes, mui, formatDate, SummaryExpansionPanel, DateOrYearSelector, CriteriaField } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginRight: theme.spacing(4)
  }
}));

const ExpandedSummary = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography variant='h6' className={classes.title}>Critères de sélection</mui.Typography>
    </div>
  );
};

ExpandedSummary.propTypes = {
};

const CollapsedSummary = ({ criteria }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.title}>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${criteria.groups.size} groupe(s) sélectionné(s)`}</mui.Typography>
    </div>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired
};

const Criteria = ({ className, criteria, onCriteriaChanged, display, onDisplayChanged }) => {

  const setCriteria = (name, value) => onCriteriaChanged({ ...criteria, [name]: value });
  const onMinDateChanged = (value) => setCriteria('minDate', value);
  const onMaxDateChanged = (value) => setCriteria('maxDate', value);
  const onMinIntegrationDateChanged = (value) => setCriteria('minIntegrationDate', value);
  const onMaxIntegrationDateChanged = (value) => setCriteria('maxIntegrationDate', value);
  //type: new immutable.List(),
  //albums: new immutable.List(),
  //persons: new immutable.List(),
  //keywords: null,
  //caption: null,
  //path: null,


  // old
  const onChildrenChanged = (value) => setCriteria('children', value);

  const setDisplay = (name, value) => onDisplayChanged({ ...display, [name]: value });
  const onInvertChanged = (value) => setDisplay('invert', value);
  const onFullnamesChanged = (value) => setDisplay('fullnames', value);

  const grid = (
    <mui.Grid container spacing={2}>
      <mui.Grid item xs={2}>
        <CriteriaField label='Date du document' />
      </mui.Grid>
      <mui.Grid item xs={2}>
        <CriteriaField label='Début'>
          <DateOrYearSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={2}>
        <CriteriaField label='Fin'>
          <DateOrYearSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={2}>
        <CriteriaField label="Date d'intégration" />
      </mui.Grid>
      <mui.Grid item xs={2}>
        <CriteriaField label='Début'>
          <DateOrYearSelector value={criteria.minIntegrationDate} onChange={onMinIntegrationDateChanged} showYearSelector />
        </CriteriaField>
      </mui.Grid>
      <mui.Grid item xs={2}>
        <CriteriaField label='Fin'>
          <DateOrYearSelector value={criteria.maxIntegrationDate} onChange={onMaxIntegrationDateChanged} showYearSelector selectLastDay />
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
    </mui.Grid>
  );

  return (
    <SummaryExpansionPanel
      className={className}
      expandedSummary={<ExpandedSummary criteria={criteria} display={display} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} display={display} />}>
      {grid}
    </SummaryExpansionPanel>
  );
};

Criteria.propTypes = {
  className: PropTypes.string,
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

export default Criteria;

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

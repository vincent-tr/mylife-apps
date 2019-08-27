'use strict';

import { React, useState, PropTypes, mui, formatDate } from 'mylife-tools-ui';

import AccountSelector from '../../common/account-selector';
import DateSelector from '../../common/date-selector';
import Field from '../common/field';
import GroupField from '../common/group-field';
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

const Panel = ({ criteria, display, onExport, children }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <mui.ExpansionPanel expanded={expanded} onChange={toggleExpanded}>
      <mui.ExpansionPanelSummary expandIcon={<mui.icons.ExpandMore />}>
        {expanded ? (
          <ExpandedSummary criteria={criteria} display={display} onExport={onExport} />
        ) : (
          <CollapsedSummary criteria={criteria} display={display} onExport={onExport} />
        )}
      </mui.ExpansionPanelSummary>
      <mui.ExpansionPanelDetails>
        {children}
      </mui.ExpansionPanelDetails>
    </mui.ExpansionPanel>
  );
};

Panel.propTypes = {
  criteria: PropTypes.object.isRequired,
  display: PropTypes.object.isRequired,
  onExport: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const Criteria = ({ criteria, onCriteriaChanged, display, onDisplayChanged, onExport, additionalComponents }) => {
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

  return (
    <Panel criteria={criteria} display={display} onExport={onExport}>
      <mui.Grid container spacing={2}>
        <mui.Grid item xs={4}>
          <Field label='Date début'>
            <DateSelector value={criteria.minDate} onChange={onMinDateChanged} showYearSelector />
          </Field>
        </mui.Grid>
        <mui.Grid item xs={4}>
          <Field label='Date fin'>
            <DateSelector value={criteria.maxDate} onChange={onMaxDateChanged} showYearSelector selectLastDay />
          </Field>
        </mui.Grid>
        <mui.Grid item xs={4}>
          <Field label='Compte'>
            <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
          </Field>
        </mui.Grid>
        <mui.Grid item xs={4}>
          <Field label='Inverser montant'>
            <mui.Checkbox color='primary' checked={display.invert} onChange={e => onInvertChanged(e.target.checked)} />
          </Field>
        </mui.Grid>
        <mui.Grid item xs={4}>
          <Field label='Afficher les groupes enfants'>
            <mui.Checkbox color='primary' checked={criteria.children} onChange={e => onChildrenChanged(e.target.checked)} />
          </Field>
        </mui.Grid>
        <mui.Grid item xs={4}>
          <Field label='Afficher les noms complets'>
            <mui.Checkbox color='primary' checked={display.fullnames} onChange={e => onFullnamesChanged(e.target.checked)} />
          </Field>
        </mui.Grid>
        {additionalComponents}
        <mui.Grid item xs={12}>
          <GroupField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
        </mui.Grid>
      </mui.Grid>
    </Panel>
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

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

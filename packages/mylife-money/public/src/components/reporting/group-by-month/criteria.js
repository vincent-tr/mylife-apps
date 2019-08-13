'use strict';

import { React, useState, PropTypes, mui, formatDate } from 'mylife-tools-ui';
import icons from '../../icons';

import AccountSelector from '../../common/account-selector';
import GroupSelector from '../../common/group-selector';

const useFieldStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginRight: theme.spacing(1)
  },
  children: {
  }
}));

const Field = ({ label, children }) => {
  const classes = useFieldStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.label}>{label}</mui.Typography>
      <div className={classes.children}>
        {children}
      </div>
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const useGroupFieldStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginRight: theme.spacing(1)
  },
  addButton: {
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

const GroupField = ({ groups, onGroupAdd, onGroupChanged, onGroupDelete }) => {
  const classes = useGroupFieldStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <mui.Typography className={classes.label}>Groupes</mui.Typography>
        <mui.Tooltip title='Ajouter un groupe'>
          <mui.IconButton onClick={() => onGroupAdd()} className={classes.addButton}>
            <icons.actions.New />
          </mui.IconButton>
        </mui.Tooltip>
      </div>
      {groups.map((group, index) => (
        <div key={index} className={classes.item}>
          <GroupSelector value={group} onChange={(value) => onGroupChanged(index, value)} />
          <mui.Tooltip title='Supprimer le groupe'>
            <mui.IconButton onClick={() => onGroupDelete(index)}>
              <icons.actions.Delete />
            </mui.IconButton>
          </mui.Tooltip>
        </div>
      ))}
    </div>
  );
};

GroupField.propTypes = {
  groups: PropTypes.object.isRequired,
  onGroupAdd: PropTypes.func.isRequired,
  onGroupChanged: PropTypes.func.isRequired,
  onGroupDelete: PropTypes.func.isRequired
};

const Criteria = ({ criteria, onCriteriaChanged }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded(!expanded);

  const setCriteria = (name, value) => onCriteriaChanged({ ...criteria, [name]: value });
  const onChildrenChanged = (value) => setCriteria('children', value);
  const onReverseChanged = (value) => setCriteria('reverse', value);
  const onMinDateChanged = (value) => setCriteria('minDate', value);
  const onMaxDateChanged = (value) => setCriteria('maxDate', value);
  const onAccountChanged = (value) => setCriteria('account', value);

  const onGroupAdd = () => setCriteria('groups', criteria.groups.push(null));
  const onGroupChanged = (index, value) => setCriteria('groups', criteria.groups.set(index, value));
  const onGroupDelete = (index) => setCriteria('groups', criteria.groups.delete(index));

  return (
    <mui.ExpansionPanel expanded={expanded} onChange={toggleExpanded}>
      <mui.ExpansionPanelSummary expandIcon={<mui.icons.ExpandMore />}>
        {expanded ? (
          <mui.Typography variant='h6'>Critères de sélection</mui.Typography>
        ) : (
          <mui.Typography>{`Du ${format(criteria.minDate)} au ${format(criteria.maxDate)}, ${criteria.groups.size} groupe(s) sélectionnés`}</mui.Typography>
        )}
      </mui.ExpansionPanelSummary>
      <mui.ExpansionPanelDetails>
        <mui.Grid container spacing={2}>
          <mui.Grid item xs={3}>
            <Field label='Date début'>
              <mui.DatePicker value={criteria.minDate} onChange={onMinDateChanged} clearable autoOk format='dd/MM/yyyy' />
            </Field>
          </mui.Grid>
          <mui.Grid item xs={3}>
            <Field label='Date fin'>
              <mui.DatePicker value={criteria.maxDate} onChange={onMaxDateChanged} clearable autoOk format='dd/MM/yyyy' />
            </Field>
          </mui.Grid>
          <mui.Grid item xs={3}>
            <Field label='Inverser montant'>
              <mui.Checkbox color='primary' checked={criteria.reverse} onChange={e => onReverseChanged(e.target.checked)} />
            </Field>
          </mui.Grid>
          <mui.Grid item xs={3}>
            <Field label='Afficher les groups enfants'>
              <mui.Checkbox color='primary' checked={criteria.children} onChange={e => onChildrenChanged(e.target.checked)} />
            </Field>
          </mui.Grid>
          <mui.Grid item xs={3}>
            <Field label='Compte'>
              <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />
            </Field>
          </mui.Grid>
          <mui.Grid item xs={9}>
            <GroupField groups={criteria.groups} onGroupAdd={onGroupAdd} onGroupChanged={onGroupChanged} onGroupDelete={onGroupDelete} />
          </mui.Grid>
        </mui.Grid>

      </mui.ExpansionPanelDetails>
    </mui.ExpansionPanel>
  );
};

Criteria.propTypes = {
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired
};

export default Criteria;

function format(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDate(date, 'dd/MM/yyyy');
}

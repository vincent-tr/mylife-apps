'use strict';

import { React, useState, PropTypes, mui, ToolbarFieldTitle, ToolbarSeparator } from 'mylife-tools-ui';
import icons from '../../icons';

import AccountSelector from '../../common/account-selector';
import GroupSelector from '../../common/group-selector';

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
        {expanded && (
          <mui.Typography>Critères de sélection</mui.Typography>
        )}
      </mui.ExpansionPanelSummary>
      <mui.ExpansionPanelDetails>
        <ToolbarFieldTitle>Inverser montant</ToolbarFieldTitle>
        <mui.Checkbox color='primary' checked={criteria.reverse} onChange={e => onReverseChanged(e.target.checked)} />

        <ToolbarFieldTitle>Afficher les groups enfants</ToolbarFieldTitle>
        <mui.Checkbox color='primary' checked={criteria.children} onChange={e => onChildrenChanged(e.target.checked)} />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
        <mui.DatePicker value={criteria.minDate} onChange={onMinDateChanged} clearable autoOk format='dd/MM/yyyy' />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
        <mui.DatePicker value={criteria.maxDate} onChange={onMaxDateChanged} clearable autoOk format='dd/MM/yyyy' />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Compte</ToolbarFieldTitle>
        <AccountSelector allowNull={true} value={criteria.account} onChange={onAccountChanged} width={200} />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Groupes</ToolbarFieldTitle>
        <mui.Tooltip title='Ajouter un groupe'>
          <mui.IconButton onClick={() => onGroupAdd()}>
            <icons.actions.New />
          </mui.IconButton>
        </mui.Tooltip>
        {criteria.groups.map((group, index) => (
          <React.Fragment key={index}>
            <ToolbarSeparator />
            <GroupSelector value={group} onChange={(value) => onGroupChanged(index, value)} />
            <mui.Tooltip title='Supprimer le groupe'>
              <mui.IconButton onClick={() => onGroupDelete(index)}>
                <icons.actions.Delete />
              </mui.IconButton>
            </mui.Tooltip>
          </React.Fragment>
        ))}
      </mui.ExpansionPanelDetails>
    </mui.ExpansionPanel>
  );
};

Criteria.propTypes = {
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired
};

export default Criteria;

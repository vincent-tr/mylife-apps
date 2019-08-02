'use strict';

import { React, PropTypes, mui, ToolbarFieldTitle, ToolbarSeparator } from 'mylife-tools-ui';
import icons from '../../icons';

import AccountSelector from '../../common/account-selector';
import GroupSelector from '../../common/group-selector';

const Toolbar = ({ criteria, onCriteriaChanged }) => {

  const setCriteria = (name, value) => onCriteriaChanged({ ...criteria, [name]: value });
  const onReverseChanged = (value) => setCriteria('reverse', value);
  const onMinDateChanged = (value) => setCriteria('minDate', value);
  const onMaxDateChanged = (value) => setCriteria('maxDate', value);
  const onAccountChanged = (value) => setCriteria('account', value);

  const onGroupAdd = () => setCriteria('groups', [ ...criteria.groups, null ]);
  const onGroupChanged = (index, value) => setCriteria('groups', [ ...criteria.groups.slice(0, index), value, ...criteria.groups.slice(index + 1) ]);
  const onGroupDelete = (index) => setCriteria('groups', [ ...criteria.groups.slice(0, index), ...criteria.groups.slice(index + 1) ]);

  return (
    <mui.Toolbar>
      <ToolbarFieldTitle>Inverser montant</ToolbarFieldTitle>
      <mui.Checkbox color='primary' checked={criteria.reverse} onChange={e => onReverseChanged(e.target.checked)} />

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
    </mui.Toolbar>
  );
};

Toolbar.propTypes = {
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired
};

export default Toolbar;

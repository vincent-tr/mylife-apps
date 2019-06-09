'use strict';

import { React, useState, PropTypes, mui, ToolbarFieldTitle, ToolbarSeparator } from 'mylife-tools-ui';
import icons from '../../icons';

import AccountSelector from '../../common/account-selector';
import GroupSelector from '../../common/group-selector';

const Toolbar = ({ onCriteriaChanged }) => {

  const [reverse, setReverse] = useState(true);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [account, setAccount] = useState(null);
  const [groups, setGroups] = useState([ null ]);

  const criteria = { reverse, minDate, maxDate, account, groups };

  const onReverseChanged = (value) => {
    setReverse(value);
    onCriteriaChanged({ ...criteria, reverse: value });
  };

  const onMinDateChanged = (value) => {
    setMinDate(value);
    onCriteriaChanged({ ...criteria, minDate: value });
  };

  const onMaxDateChanged = (value) => {
    setMaxDate(value);
    onCriteriaChanged({ ...criteria, maxDate: value });
  };

  const onAccountChanged = (value)=> {
    setAccount(value);
    onCriteriaChanged({ ...criteria, account: value });
  };

  const onGroupAdd = () => {
    const newGroups = [ ...groups, null ];
    setGroups(newGroups);
    onCriteriaChanged({ ...criteria, groups: newGroups });
  };

  const onGroupChanged = (index, value) =>  {
    const newGroups = [ ...groups.slice(0, index), value, ...groups.slice(index + 1) ];
    setGroups(newGroups);
    onCriteriaChanged({ ...criteria, groups: newGroups });
  };

  const onGroupDelete = (index) => {
    const newGroups = [ ...groups.slice(0, index), ...groups.slice(index + 1) ];
    setGroups(newGroups);
    onCriteriaChanged({ ...criteria, groups: newGroups });
  };

  return (
    <mui.Toolbar>
      <ToolbarFieldTitle>Inverser montant</ToolbarFieldTitle>
      <mui.Checkbox color='primary' checked={reverse} onChange={e => onReverseChanged(e.target.checked)} />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
      <mui.DatePicker value={minDate} onChange={onMinDateChanged} clearable autoOk format='DD/MM/YYYY' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
      <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} clearable autoOk format='DD/MM/YYYY' />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Compte</ToolbarFieldTitle>
      <AccountSelector allowNull={true} value={account} onChange={onAccountChanged} width={200} />

      <ToolbarSeparator />

      <ToolbarFieldTitle>Groupes</ToolbarFieldTitle>
      <mui.Tooltip title='Ajouter un groupe'>
        <mui.IconButton onClick={() => onGroupAdd()}>
          <icons.actions.New />
        </mui.IconButton>
      </mui.Tooltip>
      {groups.map((group, index) => (
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
  onCriteriaChanged: PropTypes.func.isRequired
};

export default Toolbar;

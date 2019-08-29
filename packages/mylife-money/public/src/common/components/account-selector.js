'use strict';

import { React, PropTypes, mui, useSelector } from 'mylife-tools-ui';
import { getAccounts } from '../../reference/selectors';

const useConnect = () => useSelector(state => ({
  accounts : getAccounts(state),
}));

function renderList(accounts, allowNull) {
  if(allowNull) {
    accounts = [ { _id: '', display: 'Tous' }, ...accounts ];
  }
  return accounts.map(account => (
    <mui.MenuItem key={account._id} value={account._id}>
      {account.display}
    </mui.MenuItem>
  ));
}

const AccountSelector = ({ allowNull, value, onChange, ...props }) => {
  const { accounts } = useConnect();
  const handleChange = e => {
    const { value } = e.target;
    onChange(value === '' ? null : value);
  };
  return (
    <mui.Select displayEmpty value={value || ''} onChange={handleChange} {...props}>
      {renderList(accounts, allowNull)}
    </mui.Select>
  );
};

AccountSelector.propTypes = {
  allowNull : PropTypes.bool.isRequired,
  value     : PropTypes.string,
  onChange  : PropTypes.func.isRequired,
};

export default AccountSelector;

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { mui } from 'mylife-tools-ui';
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

const AccountSelector = ({ allowNull = false, value, onChange = null, ...props }) => {
  const { accounts } = useConnect();
  const handleChange = e => {
    const { value } = e.target;
    onChange(value === '' ? null : value);
  };
  return (
    <mui.Select displayEmpty value={value || ''} onChange={handleChange} inputProps={{ readOnly: !onChange }} {...props}>
      {renderList(accounts, allowNull)}
    </mui.Select>
  );
};

AccountSelector.propTypes = {
  allowNull : PropTypes.bool,
  value     : PropTypes.string,
  onChange  : PropTypes.func,
};

export default AccountSelector;
